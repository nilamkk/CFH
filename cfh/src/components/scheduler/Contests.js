import Contest from "./Contest";

const Contests=props=>{


    return (
        <div>   
            {props.listOfSelectedContests.map(
                item=><Contest 
                        key={item.start_time+item.name} 
                        contestInfo={item} 
                        LocalId={props.LocalId}
                        updateReminderStatusAfterRemRemove={props.updateReminderStatusAfterRemRemove}
                        updateReminderStatusAfterRemAddition={props.updateReminderStatusAfterRemAddition}/>
            )}
        </div>
    )
}


export default Contests;