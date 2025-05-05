import { useState } from "react"
import { SideMenu, Header } from "./components"
import { Space, Button } from "antd"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Planner } from "./pages"





export default function App () {
  


  const [events, setEvents] = useState([
    
  ])
  
  const [stars, setStars] = useState([
    /*
    {
      ID:0,
      EVENTID: 0,
      DATETIME: Date Obj,
      STARS: 0-3,
      
      
    }
    */  
  
  ])
    
  const operations = {eventsOperations: [events, setEvents]}

  return (<>
  <Header/>
  <Button/>
    <div style={{ display: "flex",  flexDirection:"row",  flex: 1, }}>
      <SideMenu/>
      <Space>
        <Content operations={operations}/>
      </Space>
    </div>
      
  </>)
}

function Content({operations}) {
    return <div style={{padding:15}}>
        <Routes>
            <Route 
                path="/" 
                element={<Planner operations={operations}/>}
            />
        </Routes>
    </div>
    }
