import { createTheme } from "@material-ui/core"; 
import { blueGrey, lightBlue } from "@material-ui/core/colors"; 
export const theme = createTheme({  
    palette: {    
        primary: {      
            main: lightBlue[500],      
            light: lightBlue[300],      
            dark: lightBlue[700],    
        },    
        secondary: {      
            main: blueGrey[700],      
            light: blueGrey[500],    
        },
    }
})