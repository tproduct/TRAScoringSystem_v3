import { defineTextStyles } from "@chakra-ui/react"
// import "@fontsource/noto-sans-jp"

export const textStyles = defineTextStyles({
  body: {
    description: "The body text style - used in paragraphs",
    value: {
      // fontFamily: "Noto Sans JP, sans-serif",
      fontSize: "14px",
      letterSpacing: "0",
      textDecoration: "None",
      textTransform: "None",
      color: "blue.950"
    },
  },
  title: {
    value: {
      mt:3,
      mb:3,
      fontSize:{ base:"lg", md:"xl"},
    }
  },
  subtitle: {
    value: {
      mt:3,
      mb:3,
      fontSize:{ base:"md", md:"lg"},
    }
  }
})