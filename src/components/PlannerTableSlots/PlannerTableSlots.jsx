import { Button } from "antd"
import { StarFilled, StarOutlined } from "@ant-design/icons"

export const PlannerTableSlots = ({operations, date, star, showModal}) => {
    return (<div>
        < Button onClick={() => { showModal(1) }} icon={(star === null) ? <StarOutlined/> : <StarFilled />} />
    </div>)
}
