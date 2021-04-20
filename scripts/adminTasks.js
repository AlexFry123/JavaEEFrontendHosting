const token = localStorage.getItem('AuthToken')
token ? getTasks() : window.location.replace('login.html')

userRole = parseJwt(token).role
if(userRole === 'ROLE_USER') window.location.replace('tasks.html')

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getTasks(){

    const tasksContainer = $('#accordionExample')
    tasksContainer.empty()
    const parsedObject = parseJwt(token)
$.ajax({
    url: "https://do-to-list-jee.herokuapp.com/api/task",
    // The key needs to match your method's input parameter (case-sensitive).
    headers: {
        'Authorization': `Bearer ${token}`
    },
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    statusCode: {
        200: function (res) {
            console.log('Success',res)
            res.map((item) => tasksContainer.append(createTask(item)) )
        },
        401: function (res) {
             console.log('Error', res)
        alert( "Wrong email or password" );
        }
    }
})
}

    function addNewTask(taskData){
        $.ajax({
        type: 'POST',
        url: "https://do-to-list-jee.herokuapp.com/api/task",
        // The key needs to match your method's input parameter (case-sensitive).
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(taskData),
        statusCode: {
        200: function (res) {
            console.log('Success',res)
            $('#accordionExample').append(createTask(res))
        },
        401: function (res) {
             console.log('Error', res)
        }
    }
    })
}

    $( "#addNewTask" ).submit(function(event){
          event.preventDefault();

    const form = $( "#addNewTask" )
    const title = form.find('[name=title]').val()
    const description = form.find('[name=description]').val()
    const email = form.find('[name=email]').val()
    const creationDate = form.find('[name=creationDate]').val()
    const deadline = form.find('[name=deadline]').val()
    const status = form.find('[name=status]').val()

    $.ajax({
        url: "https://do-to-list-jee.herokuapp.com/api/user",
        // The key needs to match your method's input parameter (case-sensitive).
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        statusCode: {
        200: function (res) {
            console.log('Success',res)
            const filteredRes = res.filter((item) => item.email === email)
            console.log('filtered', filteredRes[0])
            if(res){
                addNewTask({title, description, creationDate: creationDate.toString(), deadline: deadline.toString(), status, userId: filteredRes[0].id })
            }
        },
        401: function (res) {
             console.log('Error', res)
             alert('Error occured during task creation')
        }
    } 
    })
    })


function editTask(taskId, taskData){
    $.ajax({
        type: 'PUT',
        url: `https://do-to-list-jee.herokuapp.com/api/task/${taskId}`,
        // The key needs to match your method's input parameter (case-sensitive).
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(taskData),
        statusCode: {
        200: function (res) {
            console.log('Success',res)
            getTasks()
        },
        401: function (res) {
             console.log('Error', res)
             alert('Error occurred during task editing')
        }
    }
    })
}



function editSubmit(id){
    this.event.preventDefault()
    const form = $(`#editTask${id}`)
    const taskId = form.attr("data-task-id")
    const title = form.find('[name=title]').val()
    const description = form.find('[name=description]').val()
    const email = form.find('[name=email]').val()
    const creationDate = form.find('[name=creationDate]').val()
    const deadline = form.find('[name=deadline]').val()
    const status = form.find('[name=status]').val()

     $.ajax({
        url: `https://do-to-list-jee.herokuapp.com/api/user`,
        // The key needs to match your method's input parameter (case-sensitive).
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        statusCode: {
        200: function (res) {
            console.log('Success',res)
            const filteredRes = res.filter((item) => item.email === email)
            console.log('filtered', filteredRes[0])
            if(res){
                editTask(taskId, {title, description, creationDate: creationDate.toString(), deadline: deadline.toString(), status, userId: filteredRes[0].id })
            }
        },
        401: function (res) {
             console.log('Error', res)
             alert('Error occured during task creation')
        }
        } 
    })
}

function onExit(){
    localStorage.removeItem('AuthToken')
    window.location.replace('login.html')
}

function deleteTask(id){
    $.ajax({
        type: 'DELETE',
        url: `https://do-to-list-jee.herokuapp.com/api/task/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        statusCode: {
            200: function (res) {
                console.log('Success',res)
                $(`#task${id}`).remove()
            },
            401: function (res) {
                console.log('Error', res)
                alert('Error occured during task deletion')
            }
        }
    })
}

function createTask(data){
    return `
        <div class="card m-2" id="task${data.id}">
            <div class="card-header custom-header" id="heading${data.id}">
                <div style="flex: 3">
                    ${data.title}
                </div>
                <div style="flex: 4">
                    ${data.description}
                </div>
                <div style="flex: 3">
                    ${data.user.email}
                </div>
                <div style="flex: 2">
                    ${new Date(data.creationDate).getUTCDate()}.${new Date(data.creationDate).getUTCMonth()}.${new Date(data.creationDate).getUTCFullYear()}
                </div>
                <div style="flex: 2">
                    ${new Date(data.deadline).getUTCDate()}.${new Date(data.deadline).getUTCMonth()}.${new Date(data.deadline).getUTCFullYear()}
                </div>
                <div style="flex: 1">
                    ${data.status.toLowerCase()}
                </div>
                <div>
                    <button class="btn btn-link custom-button" type="button" data-toggle="collapse" data-target="#collapse${data.id}"
                        aria-expanded="false" aria-controls="collapse${data.id}">
                                <img src="../media/edit.svg" alt='edit' class="icon" />
                    </button>
                    <button class="btn btn-link custom-button" type="button" onclick="deleteTask(${data.id})">
                                <img src="../media/trash.svg" alt='delete' class="icon" />
                    </button>
                </div>
            </div>
                
            <div id="collapse${data.id}" class="collapse" aria-labelledby="heading${data.id}" data-parent="#accordionExample">
                
                <form id="editTask${data.id}" data-task-id="${data.id}" onsubmit="editSubmit(${data.id})">
                    <div class="row mb-2">
                        <div class="col">
                            <input type="text" class="form-control" placeholder="Task title" name="title" value="${data.title}"/>
                        </div>
                        <div class="col">
                            <input class="form-control" placeholder="Description" name="description" value="${data.description}"/>
                        </div>
                        <div class="col">
                            <input type="email" class="form-control" placeholder="Assigned email" name="email" value="${data.user.email}"/>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col">
                            <input type='date' class="form-control" placeholder="Enter start date" name="creationDate" />
                        </div>
                        <div class="col">
                            <input type='date' class="form-control" placeholder="Enter deadline date" name="deadline"/>
                        </div>
                        <div class="col">
                            <select id="inputState" class="form-control" name="status">
                                <option ${data.status === "TO_DO" ? "selected" : ""}>TO_DO</option>
                                <option ${data.status === "IN_PROGRESS" ? "selected" : ""}>IN_PROGRESS</option>
                                <option ${data.status === "DONE" ? "selected" : ""}>DONE</option>
                            </select>
                        </div>
                    </div>
                    <div class="row" style="justify-content: center;">
                        <div class="col">
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    `
}