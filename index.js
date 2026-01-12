const fs = require("fs");
const {Command} = require("commander");


const program = new Command();

function readJSONfile(file){
    return new Promise(resolve =>{
        fs.readFile(file, "utf-8", (err, data) =>{
            if(err){
                console.log(err);
            }else{
                resolve(data);
            }
        })
    })
}



program
    .name("task app")
    .description("add,read, delete and mark tasks done/undone")
    .version("0.2.0")

program.command("add")
    .description("add tasks to the task app")
    .argument("<string>", " task to add")
    .action(
        (str)=>{
        // reading the json file
        readJSONfile("todos.json").then((content)=> {

            if(content=="" || content==="[]"){
                let newTaskId = "1";
                let newStruct = [];
                let obj = {
                    [newTaskId] : {
                        "taskName": str,
                        "done": false
                    }
                }
                newStruct.push(obj)
                fs.writeFile("todos.json", JSON.stringify(newStruct, null, 2), (err)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                })
            }else if(content!=""){
                let task_list = JSON.parse(content);

                
                let taskIds = []
                for(let task of task_list){
                    taskIds.push(Object.keys(task)[0])
                }
            
                taskIds = taskIds.map((taskId)=> Number(taskId));

                let maxVal = taskIds[0]
                for(let taskId of taskIds){
                    if(taskId >= maxVal){
                        maxVal = taskId;
                    }
                }
                let newId = maxVal + 1;
                let obj = {
                    [newId] : {
                        "taskName" : str,
                        "done" : false
                    }
                }
                task_list.push(obj)
      
                fs.writeFile("todos.json", JSON.stringify(task_list,null, 2), (err) =>{
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        console.log("Task added successfully!")
                    }
                })
            

                }
            
        })
        }
    )
program.command("show")
    .description("show the list of all tasks irrespective of the status")
    .action(
        ()=>{
            readJSONfile("todos.json").then((content)=>{
                let task_list = JSON.parse(content);
                let doneTasks = [];
                let notDoneTasks = [];


                for(let task of task_list){
                    let taskId = Object.keys(task)[0];
                    let taskName = Object.values(task)[0]["taskName"];
                    let done = Object.values(task)[0]["done"];
                    if(done==false){
                        notDoneTasks.push(task)
                    }else{
                        doneTasks.push(task)
                    }
                }
                
                console.log("Not Done:")
                for(let task of notDoneTasks){
                    let taskId = Object.keys(task)[0];
                    let taskName = Object.values(task)[0]["taskName"];
                    console.log(`${taskId}: ${taskName}`);
                }
                console.log()
                console.log()
                console.log("Done:")
                for(let task of doneTasks){
                    let taskId = Object.keys(task)[0];
                    let taskName = Object.values(task)[0]["taskName"];
                    console.log(`${taskId}: ${taskName}`)
                    
                }
                console.log();

            })
        }
    )

program.command("delete")
    .description("Delete a task with a particular id")
    .argument("<id>", "id of the task to delete")
    .action(
        (id)=>{
            readJSONfile("todos.json").then((content)=>{

                let task_list = JSON.parse(content)

                let removeId = null;
                for(let task in task_list){
                    if(Object.keys(task_list[task])[0] == Number(id)){
                        removeId = task

                        
                    }
                }
                task_list.splice(removeId, 1);

                fs.writeFile("todos.json", JSON.stringify(task_list, null, 2), (err)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Task deleted successfully!")
                    }
                })

                
                
            })
        }
    )


program.command("mark")
    .description("mark the task as done/undone")
    .argument("<id>", "id of the task to be marked")
    .argument("<markAs>", "done/undone")
    .action(
        (id, markAs)=>{
            readJSONfile("todos.json").then((content)=>{
                let task_list = JSON.parse(content);
                for(let task in task_list){
                    let taskId = Object.keys(task_list[task])[0];
                    let taskName = Object.values(task_list[task])[0]["taskName"]
                    let taskStatus = Object.values(task_list[task])[0]["done"];
                    if(taskId ==id){
        
                        if(markAs == "done"){
   
                            taskStatus = Object.values(task_list[task])[0]["done"] = true;
                            console.log(`"${taskName}" was marked as done`)
                        }else if(markAs =="not done"){
                            taskStatus = Object.values(task_list[task])[0]["done"] = false;
                            console.log(`"${taskName}" was marked as not done`)
                        }
                    }
                }

                fs.writeFile("todos.json", JSON.stringify(task_list, null, 2), (err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("task was updated successfully!");
                    }
                })
            })
        }
    )
program.parse()