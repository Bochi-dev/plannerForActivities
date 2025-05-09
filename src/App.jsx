import { useState } from "react"
import { SideMenu, Header } from "./components"
import { Space, Button } from "antd"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Planner } from "./pages"
import { loadEventsFromLocalStorage } from "./tools"

const loadedEvents = loadEventsFromLocalStorage()
console.log(loadedEvents)


export default function App () {
  const [events, setEvents] = useState([
//    {
//      "ID": 134,
//      "TITLE": "Proceso de ensenanza - Aprendizaje (Carmen Florentino)",
//      "STARTDATE": new Date("2025-05-05T14:00:00.100Z"),
//      "ENDDATE": new Date("2025-05-05T17:00:00.100Z"),
//      "ALLDAY": false,
//      "STARS": 0,
//      "DONE": false,
//      "REPEATSETTINGS": {
//        "TYPE": "WEEKLY",
//        "INTERVAL": 1,
//        "ENDTYPE": "NEVER",
//        "WEEKLYDAYS": [
//          1,
//          4
//        ]
//      }
//    },
//    {
//      "ID": 33,
//      "TITLE": "Execersise",
//      "STARTDATE": new Date("2025-05-05T23:00:00.400Z"),
//      "ENDDATE": new Date("2025-05-06T00:00:00.400Z"),
//      "ALLDAY": false,
//      "STARS": 0,
//      "DONE": false,
//      "REPEATSETTINGS": {
//        "TYPE": "DAILY",
//        "INTERVAL": 2,
//        "ENDTYPE": "AFTERXCYCLES",
//        "ENDAFTEROCCURRENCES": 30
//      }
//    },
    ... loadedEvents,
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
