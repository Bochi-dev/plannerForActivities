import { Space, Flex, Drawer } from "antd"
import { SideMenu } from "./../"
import { MenuOutlined } from "@ant-design/icons"

export const Header = ({openDrawer, setOpenDrawer}) => {
  return (
    <>
      <div>
        <div
          style={{
            backgroundColor: "#8EA4D2",
            height: 60,
            paddingLeft: 12,
            paddingTop: 12,

          }}
          className="menuIcon" // This class is for display toggling, not layout here
        >
          {/* Invisible placeholder to push title to center */}
          <div style={{ visibility: 'hidden', width: '24px' }}></div> 
          {/* You can adjust width: '24px' to match the actual width of MenuOutlined icon */}
          
          <h2 style={{ margin: 0, color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Time Manager
          </h2>
          
          <MenuOutlined
            onClick={() => { setOpenDrawer(true) }}
            style={{ fontSize: '24px', color: 'white' }} // Style the icon
          />
        </div>
        
        
        {/*---------------------------------------------------------------------------*/}

        <div
          style={{
            backgroundColor: "#8EA4D2",
          }}
          className="headerMenu"
        >
          <SideMenu/>
        </div>

        <Drawer
          bodyStyle={{ backgroundColor: "#8EA4D2"}}
          open={openDrawer}
          closable={false}
          onClose={() => {
              setOpenDrawer(false)
          }}
        >
          <SideMenu isInline />
        </Drawer>
      </div>
    </>
  )
}
