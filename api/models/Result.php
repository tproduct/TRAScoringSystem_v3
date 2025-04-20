<?php
namespace model;
require_once __DIR__ . "/Model.php";

use db\DataSource;
use model\Model;
use errorhandler\ErrorHandler;

/**
 * タイブレーク
 * TRA個人
 * 　予選１
 * 　　２つの演技の合計得点->T->H->D
 * 　予選２、決勝
 * 　　T->H->D
 * TRAシンクロ
 * 　予選１
 * 　　２つの演技の合計得点->S->H->D
 * 　予選２
 * 　　S->H->D
 * TUM・DMT
 * 　予選１
 * 　　２本の演技のD得点の合計->２本の演技の全E得点の合計->２本の演技のペナルティの合計->１つの演技のD得点
 * 　予選２
 * 　　予選１の順位
 * 　決勝１
 * 　　予選２の順位
 * 　決勝２
 * 　　決勝１の順位
 * 
 * 　問題点
 * 　　TRA予選１で２本の演技が同じ得点だった場合はタイブレークできない
 */

class Result extends Model
{

  private static function generateTieBreakStmtOfQualify($compType)
  {
    return $compType === "TRA"
      ? "ROUND(IFNULL(q1.sum, 0) + IFNULL(q2.sum, 0), 2) DESC,
          CASE WHEN IFNULL(q1.sum, 0) >= IFNULL(q2.sum, 0) THEN q1.time ELSE q2.time END DESC,
          CASE WHEN IFNULL(q1.sum, 0) >= IFNULL(q2.sum, 0) THEN q1.hd   ELSE q2.hd   END DESC,
          CASE WHEN IFNULL(q1.sum, 0) >= IFNULL(q2.sum, 0) THEN q1.diff ELSE q2.diff END DESC"
      : "IFNULL(q1.diff, 0) + IFNULL(q2.diff, 0) DESC,
       IFNULL(e_sum1.e_sum, 0) + IFNULL(e_sum2.e_sum, 0) DESC,
       IFNULL(q1.pen, 0) + IFNULL(q2.pen, 0) ASC,
       GREATEST(IFNULL(q1.diff, 0), IFNULL(q2.diff, 0))
      ";
  }

  private static function generateJoinStmt($compType)
  {
    return $compType !== "TRA"
      ? "LEFT JOIN (
        SELECT score_id, SUM(sum) AS e_sum
        FROM escores
        WHERE judge != 'med'
        GROUP BY score_id
      ) AS e_sum1 ON e_sum1.score_id = q1.id
      LEFT JOIN (
        SELECT score_id, SUM(sum) AS e_sum
        FROM escores
        WHERE judge != 'med'
        GROUP BY score_id
      ) AS e_sum2 ON e_sum2.score_id = q2.id"
      : "";
  }

  private static function generateCTEOfQualifyRank()
  {
    $tieBreakStmt = self::generateTieBreakStmtOfQualify("DMT");
    $joinStmt = self::generateJoinStmt("DMT");

    return "WITH qualify_ranks AS (
      SELECT o1.player_id,
            RANK() OVER (ORDER BY IFNULL(q1.sum, 0) + IFNULL(q2.sum, 0) DESC, $tieBreakStmt) AS `rank`
      FROM orders o1
      LEFT JOIN orders o2 ON o2.player_id = o1.player_id AND o2.routine = '2' AND o2.round = 'qualify'
      LEFT JOIN scores q1 ON q1.order_id = o1.id
      LEFT JOIN scores q2 ON q2.order_id = o2.id
      $joinStmt
      WHERE o1.round = 'qualify' AND o1.routine = '1'
    )";
  }

  private static function generateCTEOfSemifinalRank()
  {
    $qualifyRankCTE = self::generateCTEOfQualifyRank();

    return "
      $qualifyRankCTE,
      semifinal_ranks AS (
        SELECT o.player_id,
              RANK() OVER (
                ORDER BY s.sum DESC, q.rank ASC
              ) AS `rank`
        FROM orders o
        JOIN scores s ON s.order_id = o.id
        JOIN qualify_ranks q ON q.player_id = o.player_id
        WHERE o.round = 'semifinal'
      )";
  }

  private static function generateCTEOfFinalRank()
  {
    $semifinalRankCTE = self::generateCTEOfSemifinalRank();

    return "
      $semifinalRankCTE,
      final1_ranks AS (
        SELECT o.player_id,
              RANK() OVER (
                ORDER BY s.sum DESC, sf.rank ASC
              ) AS `rank`
        FROM scores s
        JOIN orders o ON s.order_id = o.id AND o.round = 'final' AND o.routine = '1'
        JOIN semifinal_ranks sf ON o.player_id = sf.player_id
      )";
  }

  public static function getQualifyResult($compType, $type, $gender, $categoryId, $isTotal)
  {
    $db = new DataSource();

    $baseElement = $isTotal
      ? "ROUND(IFNULL(q1.sum, 0) + IFNULL(q2.sum, 0), 2)"
      : "GREATEST(IFNULL(q1.sum, 0), IFNULL(q2.sum, 0))";

    $totalStmt = $isTotal
      ? "$baseElement AS total"
      : "$baseElement AS best";

    $tieBreakStmt = self::generateTieBreakStmtOfQualify($compType);

    $joinStmt = self::generateJoinStmt($compType);

    $result = $db->select(
      "SELECT p.name, p.phonetic, team, o1.player_id, q1.exe, q1.diff, q1.hd, q1.time, q1.sum, q1.dns,
            e1.s1, e1.s2, e1.s3, e1.s4, e1.s5, e1.s6, e1.s7, e1.s8, e1.s9, e1.s10, e1.lnd,
            q2.exe AS exe_2, q2.diff AS diff_2, q2.hd AS hd_2, q2.time AS time_2, q2.sum AS sum_2, q2.dns AS dns_2,
            e2.s1 AS s1_2, e2.s2 AS s2_2, e2.s3 AS s3_2, e2.s4 AS s4_2, e2.s5 AS s5_2,
            e2.s6 AS s6_2, e2.s7 AS s7_2, e2.s8 AS s8_2, e2.s9 AS s9_2, e2.s10 AS s10_2, e2.lnd AS lnd_2,
            '1' AS label_1, '2' AS label_2,
            $totalStmt,
            RANK() OVER (
              ORDER BY
                $baseElement DESC,
                $tieBreakStmt
            ) AS `rank`
            FROM scores q1
            JOIN orders o1 ON q1.order_id = o1.id AND o1.routine = '1' AND o1.round = 'qualify'
            LEFT JOIN orders o2 ON o2.player_id = o1.player_id AND o2.routine = '2' AND o2.round = 'qualify'
            LEFT JOIN scores q2 ON q2.order_id = o2.id
            LEFT JOIN escores e1 ON q1.id = e1.score_id AND e1.judge = 'med'
            LEFT JOIN escores e2 ON q2.id = e2.score_id AND e2.judge = 'med'
            $joinStmt
            JOIN {$type}_players p ON p.id = o1.player_id
            JOIN categories c ON c.id = p.category_id
            WHERE c.id = :categoryId AND o1.gender = :gender",
      ["categoryId" => $categoryId, "gender" => $gender]
    );

    return $result;
  }
  public static function getQualifyResultByTotal($compType, $type, $gender, $categoryId)
  {
    return self::getQualifyResult($compType, $type, $gender, $categoryId, true);
  }

  public static function getQualifyResultByBest($compType, $type, $gender, $categoryId)
  {
    return self::getQualifyResult($compType, $type, $gender, $categoryId, false);
  }

  public static function getSemifinalResultOfTRA($type, $gender, $categoryId)
  {
    $db = new DataSource();

    $result = $db->select(
      "SELECT p.name, p.phonetic, team, o.player_id, s.exe, s.diff, s.hd, s.time, s.sum, s.dns,
              e1.s1, e1.s2, e1.s3, e1.s4, e1.s5, e1.s6, e1.s7, e1.s8, e1.s9, e1.s10, e1.lnd,
              'Q2' AS label_1,
              RANK() OVER (
                ORDER BY
                  s.sum DESC, s.time DESC, s.hd DESC, s.diff DESC
              ) AS `rank`
              FROM scores s
              JOIN orders o ON s.order_id = o.id AND o.routine = '1' AND o.round = 'semifinal'
              LEFT JOIN escores e1 ON s.id = e1.score_id AND e1.judge = 'med'
              JOIN {$type}_players p ON p.id = o.player_id
              JOIN categories c ON c.id = p.category_id
              WHERE c.id = :categoryId AND o.gender = :gender",
      ["categoryId" => $categoryId, "gender" => $gender]
    );

    return $result;
  }

  public static function getSemifinalResultOfDMT($type, $gender, $categoryId)
  {
    $db = new DataSource();

    $qualifyRankCTE = self::generateCTEOfQualifyRank();

    $result = $db->select(
      "{$qualifyRankCTE}
            SELECT
            p.name, p.phonetic, team, sf.player_id, sf.exe, sf.diff, sf.hd, sf.time, sf.sum, sf.dns,
            e1.s1, e1.s2, e1.s3, e1.s4, e1.s5, e1.s6, e1.s7, e1.s8, e1.s9, e1.s10, e1.lnd,
            sf.player_id,
            q.rank AS qualify_rank,
            'Q2' AS label_1,
            RANK() OVER (
              ORDER BY sf.sum DESC, q.rank ASC
            ) AS `rank`
          FROM (
            SELECT o.player_id, s.id, s.exe, s.diff, s.time, s.hd, s.sum, s.dns, o.gender
            FROM scores s
            JOIN orders o ON s.order_id = o.id
            WHERE o.round = 'semifinal' -- ← 準決勝の成績
          ) AS sf
          JOIN qualify_ranks AS q ON sf.player_id = q.player_id
          JOIN {$type}_players p ON p.id = sf.player_id
          JOIN categories c ON c.id = p.category_id
          LEFT JOIN escores e1 ON sf.id = e1.score_id AND e1.judge = 'med'
          WHERE c.id = :categoryId AND sf.gender = :gender
          "
      ,
      ["categoryId" => $categoryId, "gender" => $gender]
    );

    return $result;
  }

  public static function getFinalResultOfTRA($type, $gender, $categoryId, $refresh)
  {
    $db = new DataSource();

    $result = $refresh ? $db->select(
      "SELECT p.name, p.phonetic, team, o.player_id, s.exe, s.diff, s.hd, s.time, s.sum, s.dns,
              e1.s1, e1.s2, e1.s3, e1.s4, e1.s5, e1.s6, e1.s7, e1.s8, e1.s9, e1.s10, e1.lnd,
              'F' AS label_1,
              RANK() OVER (
                ORDER BY
                  s.sum DESC, s.time DESC, s.hd DESC, s.diff DESC
              ) AS `rank`
              FROM scores s
              JOIN orders o ON s.order_id = o.id AND o.routine = '1' AND o.round = 'final'
              LEFT JOIN escores e1 ON s.id = e1.score_id AND e1.judge = 'med'
              JOIN {$type}_players p ON p.id = o.player_id
              JOIN categories c ON c.id = p.category_id
              WHERE c.id = :categoryId AND o.gender = :gender",
      ["categoryId" => $categoryId, "gender" => $gender]
    )
      : $db->select(
        "SELECT p.name, p.phonetic, team, o1.player_id, q1.exe, q1.diff, q1.hd, q1.time, q1.sum, q1.dns,
            e1.s1, e1.s2, e1.s3, e1.s4, e1.s5, e1.s6, e1.s7, e1.s8, e1.s9, e1.s10, e1.lnd,
            q2.exe AS exe_2, q2.diff AS diff_2, q2.hd AS hd_2, q2.time AS time_2, q2.sum AS sum_2, q2.dns AS dns_2,
            e2.s1 AS s1_2, e2.s2 AS s2_2, e2.s3 AS s3_2, e2.s4 AS s4_2, e2.s5 AS s5_2,
            e2.s6 AS s6_2, e2.s7 AS s7_2, e2.s8 AS s8_2, e2.s9 AS s9_2, e2.s10 AS s10_2, e2.lnd AS lnd_2,
            f.exe AS exe_f, f.diff AS diff_f, f.hd AS hd_f, f.time AS time_f, f.sum AS sum_f, f.dns AS dns_f,
            ef.s1 AS s1_f, ef.s2 AS s2_f, ef.s3 AS s3_f, ef.s4 AS s4_f, ef.s5 AS s5_f,
            ef.s6 AS s6_f, ef.s7 AS s7_f, ef.s8 AS s8_f, ef.s9 AS s9_f, ef.s10 AS s10_f, ef.lnd AS lnd_f,
            '1' AS label_1, '2' AS label_2, 'F' AS label_3,
            ROUND(IFNULL(q1.sum, 0) + IFNULL(q2.sum, 0) + IFNULL(f.sum, 0), 2) as total,
            RANK() OVER (
              ORDER BY
                ROUND(IFNULL(q1.sum, 0) + IFNULL(q2.sum, 0) + IFNULL(f.sum, 0), 2) DESC,
                f.time DESC, f.hd DESC, f.diff DESC
            ) AS `rank`
            FROM scores q1
            JOIN orders o1 ON q1.order_id = o1.id AND o1.routine = '1' AND o1.round = 'qualify'
            LEFT JOIN orders o2 ON o2.player_id = o1.player_id AND o2.routine = '2' AND o2.round = 'qualify'
            LEFT JOIN scores q2 ON q2.order_id = o2.id
            LEFT JOIN orders o3 ON o3.player_id = o1.player_id AND o3.routine = '1' AND o3.round = 'final'
            LEFT JOIN scores f ON f.order_id = o3.id
            LEFT JOIN escores e1 ON q1.id = e1.score_id AND e1.judge = 'med'
            LEFT JOIN escores e2 ON q2.id = e2.score_id AND e2.judge = 'med'
            LEFT JOIN escores ef ON f.id = ef.score_id AND ef.judge = 'med'
            JOIN {$type}_players p ON p.id = o1.player_id
            JOIN categories c ON c.id = p.category_id
            WHERE c.id = :categoryId AND o1.gender = :gender",
        ["categoryId" => $categoryId, "gender" => $gender]
      );

    return $result;
  }

  public static function getFinalResultOfDMT($type, $gender, $categoryId, $routine)
  {
    $db = new DataSource();

    $semifinalRankCTE = self::generateCTEOfSemifinalRank();
    $finalRankCTE = self::generateCTEOfFinalRank();

    $result = $routine === "1"
      ? $db->select(
        "{$semifinalRankCTE}
            SELECT
              p.name, p.phonetic, team, f1.player_id, f1.exe, f1.diff, f1.hd, f1.time, f1.sum, f1.dns,
              e1.s1, e1.s2, e1.s3, e1.s4, e1.s5, e1.s6, e1.s7, e1.s8, e1.s9, e1.s10, e1.lnd,
              sf.rank AS semifinal_rank,
              'F1' AS label_1,
              RANK() OVER (
                ORDER BY f1.sum DESC, sf.rank ASC
              ) AS `rank`
            FROM (
              SELECT o.player_id, s.id, s.exe, s.diff, s.time, s.hd, s.sum, s.dns, o.gender
              FROM scores s
              JOIN orders o ON s.order_id = o.id
              WHERE o.round = 'final' AND o.routine = '1'
            ) AS f1
            JOIN semifinal_ranks sf ON f1.player_id = sf.player_id
            JOIN {$type}_players p ON p.id = f1.player_id
            JOIN categories c ON c.id = p.category_id
            LEFT JOIN escores e1 ON f1.id = e1.score_id AND e1.judge = 'med'
            WHERE c.id = :categoryId AND f1.gender = :gender",
        ["categoryId" => $categoryId, "gender" => $gender]
      )
      : $db->select(
        "{$finalRankCTE}
            SELECT p.name, p.phonetic, team, f2.player_id, s.exe, s.diff, s.hd, s.time, s.sum, s.dns,
                  e.s1, e.s2, e.s3, e.s4, e.s5, e.s6, e.s7, e.s8, e.s9, e.s10, e.lnd,
                  f1.s1 AS s1_1, f1.s2 AS s2_1, f1.s3 AS s3_1, f1.s4 AS s4_1, f1.s5 AS s5_1,
                  f1.s6 AS s6_1, f1.s7 AS s7_1, f1.s8 AS s8_1, f1.s9 AS s9_1, f1.s10 AS s10_1, f1.lnd AS lnd_1,
                  'F2' AS label_1,
                  RANK() OVER (
                    ORDER BY s.sum DESC, f1r.rank ASC
                  ) AS `rank`
            FROM scores s
            JOIN orders f2 ON s.order_id = f2.id AND f2.round = 'final' AND f2.routine = '2'
            LEFT JOIN escores e ON s.id = e.score_id AND e.judge = 'med'
            JOIN {$type}_players p ON p.id = f2.player_id
            JOIN categories c ON c.id = p.category_id
            LEFT JOIN final1_ranks f1r ON f2.player_id = f1r.player_id
            LEFT JOIN orders f1o ON f1o.player_id = f2.player_id AND f1o.round = 'final' AND f1o.routine = '1'
            LEFT JOIN scores f1s ON f1o.id = f1s.order_id
            LEFT JOIN escores f1 ON f1s.id = f1.score_id AND f1.judge = 'med'
            WHERE c.id = :categoryId AND f2.gender = :gender",
        ["categoryId" => $categoryId, "gender" => $gender]
      );

    return $result;
  }

  public static function getTeamResult($gender, $competitionId, $categoryId, $teamByCat, $teamRoutines)
  {
    $categoryCondStmt = $teamByCat ? "AND tp.category_id = :categoryId" : "";
    $params = ["competitionId" => $competitionId, "gender" => $gender];
    if($teamByCat) $params["categoryId"] = $categoryId;

    $teamPlayersCTE = "(
            SELECT id, name, competition_id, category_id, player1 AS player_id FROM teams
            UNION
            SELECT id, name, competition_id, category_id, player2 FROM teams
            UNION
            SELECT id, name, competition_id, category_id, player3 FROM teams
            UNION
            SELECT id, name, competition_id, category_id, player4 FROM teams WHERE player4 IS NOT NULL)";

    $teamScoresCTE_1 = "(
            SELECT id, score, RANK() OVER (ORDER BY score DESC) AS `rank`
            FROM (
              SELECT id, SUM(sum) AS score
              FROM (
                SELECT
                  tp.id,
                  s.sum,
                  ROW_NUMBER() OVER (PARTITION BY tp.id ORDER BY s.sum DESC) AS rankInTeam
                FROM team_players tp
                JOIN orders o ON o.player_id = tp.player_id AND o.round = 'qualify'
                JOIN individual_players ip ON ip.id = tp.player_id
                JOIN qualify_rules qr ON qr.category_id = ip.category_id AND o.routine = qr.routines
                JOIN scores s ON s.order_id = o.id
                WHERE ip.gender = :gender {$categoryCondStmt}
              ) ranked
              WHERE rankInTeam <= 3
              GROUP BY id
            ) team_scores)";

    $teamScoresCTE_2 = "(
            SELECT id, score, RANK() OVER (ORDER BY score DESC) AS `rank`
            FROM (
              SELECT id, SUM(player_total) AS score
              FROM (
                SELECT
                  tp.id AS id,
                  tp.player_id,
                  SUM(s.sum) AS player_total,
                  ROW_NUMBER() OVER (PARTITION BY tp.id ORDER BY SUM(s.sum) DESC) AS rankInTeam
                FROM team_players tp
                JOIN orders o ON o.player_id = tp.player_id AND o.round = 'qualify'
                JOIN individual_players ip ON ip.id = tp.player_id
                JOIN scores s ON s.order_id = o.id
                WHERE ip.gender = :gender {$categoryCondStmt}
                GROUP BY tp.id, tp.player_id
              ) ranked
              WHERE rankInTeam <= 3
              GROUP BY id
            ) team_scores)";

    $joinStmt_1 = "LEFT JOIN orders o1 ON o1.player_id = tp.player_id AND o1.round = 'qualify'
             LEFT JOIN scores s1 ON s1.order_id = o1.id
             JOIN qualify_rules qr ON qr.category_id = ip.category_id AND o1.routine = qr.routines";

    $joinStmt_2 = "
            LEFT JOIN orders o1 ON o1.player_id = tp.player_id AND o1.round = 'qualify' AND o1.routine = '1'
            LEFT JOIN scores s1 ON s1.order_id = o1.id
            LEFT JOIN orders o2 ON o2.player_id = tp.player_id AND o2.round = 'qualify' AND o2.routine = '2'
            LEFT JOIN scores s2 ON s2.order_id = o2.id
            ";

    $teamScoresCTE = $teamRoutines === "1" ? $teamScoresCTE_1 : $teamScoresCTE_2;
    $joinStmt = $teamRoutines === "1" ? $joinStmt_1 : $joinStmt_2;

    $selectStmt = $teamRoutines === "2" ? ", s2.sum AS sum_2" : "";

    $db = new DataSource();
    $result = $db->select(
      "WITH team_players AS ({$teamPlayersCTE}), team_scores AS ({$teamScoresCTE}) " .
      "SELECT `rank`, tp.id AS team_id, tp.name as team_name, score, ip.name as player_name, s1.sum AS sum_1 {$selectStmt}
             FROM team_players tp
             JOIN team_scores ts ON tp.id = ts.id
             JOIN individual_players ip ON ip.id = tp.player_id
             {$joinStmt}
             WHERE tp.competition_id = :competitionId
             ORDER BY score DESC, o1.number ASC
    ",
      $params
    );

    return $result;
  }

}