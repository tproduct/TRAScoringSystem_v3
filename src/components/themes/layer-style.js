import { defineLayerStyles } from '@chakra-ui/react';

export const layerStyles = defineLayerStyles({
  body:{
    value:{
      bg: 'white',
      color: 'blue.950'
    }
  },
  header : {
    description: 'header styles',
    value: {
      color: 'blue.50',
      bg: 'blue.950',
      // borderBottomWidth: '1px',
      // borderBottomColor: 'black',
      // borderLeftWidth: '10px',
      // borderLeftColor: 'blue.50',
      height: "6vh",
    },

  },
  sidemenu :{
    description: 'sidemenu styles',
    value: {
      color: 'blue.950',
      bg: 'white',
      borderRightmWidth: '3px',
      borderBottomColor: 'black',
    }
  },
  boxSingle :{
    description: '横幅いっぱい',
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      width:{
        base:"100%", md:"98%"
      },
      p:"2",
      mb:"2",
      boxShadow:"md",
    }
  },
  boxHalf :{
    description: '横幅２分の１',
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      width:{
        base:"100%", md:"50%"
      },
      p:"2",
      mb:"2",
      boxShadow:"md",
    }
  },
  boxThird :{
    description: '横幅３分の１',
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      width:{
        base:"100%", md:"32%"
      },
      p:"2",
      mb:"2",
      boxShadow:"md",
    }
  },
boxQuarter :{
    description: '横幅４分の１',
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      width:{
        base:"100%", md:"24%"
      },
      p:"2",
      mb:"2",
      boxShadow:"md",
    }
  },
  configsSingle :{
    description: '大会設定ページ用BOX',
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      p:"2",
      mb:"2",
      boxShadow:"md",
    }
  },
  userHomeContainer :{
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      boxShadow:"md",
      p:"2"
    }
  },
  container: {
    description: 'container styles',
    value: {
      background: 'purple.500',
      border: '2px solid',
      borderColor: 'gray.500',
    },
  },
  button:{
    description: 'button styles',
    value: {
      bg: 'blue.400'
    }
  },
  keyButton :{
    description: 'Keyboard Button',
    value: {
      border:"1px solid",
      borderColor:"gray.400",
      borderRadius:"md",
      p:"2",
      mb:"2",
      boxShadow:"md",
      color:"myBlue.800"
    }
  },
  submit_create:{
    description: 'submit button',
    value: {
      color:"blue.50",
      bg:"blue.400",
      _hover:{bg:"blue.800"},
      boxShadow: "md"
    }
  },
  submit_update:{
    description: 'submit button',
    value: {
      color:"blue.50",
      bg:"blue.800",
      _hover:{bg:"blue.600"},
      boxShadow: "md"
    }
  },
  submit_sync:{
    description: 'submit button',
    value: {
      color:"blue.50",
      bg:"blue.800",
      _hover:{bg:"blue.600"},
      boxShadow: "md"
    }
  },
  submit_delete:{
    description: 'submit button',
    value: {
      color:"blue.50",
      bg:"red",
      _hover:{bg:"red.600"},
      boxShadow: "md"
    }
  }
});
