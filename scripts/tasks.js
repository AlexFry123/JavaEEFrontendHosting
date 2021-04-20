const token = localStorage.getItem('AuthToken')
token ? getTasks() : window.location.replace('./login.html')

userRole = parseJwt(token).role
if(userRole === 'ROLE_ADMIN') window.location.replace('./adminTasks.html')

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

function onExit(){
    localStorage.removeItem('AuthToken')
    window.location.replace('login.html')
}

function markAsDone(){
    console.log('Marked')
}

function createTask(data){
    return `
        <div class="card m-2">
            <div class="card-header custom-header" id="heading${data.id}">
                <h5 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${data.id}"
                                aria-expanded="false" aria-controls="collapse${data.id}">
                                ${data.title}
                    </button>
                </h5>
                <div class='${data.status === 'DONE' ? 'status-badge' : 'status-pending'}'>
                    ${data.status.toLowerCase()}
                </div>
            </div>
                
            <div id="collapse${data.id}" class="collapse" aria-labelledby="heading${data.id}" data-parent="#accordionExample">
                <div class="time-section">
                    <div>
                        Created at: ${new Date(data.creationDate).getDate()}.${new Date(data.creationDate).getMonth()}.${new Date(data.creationDate).getFullYear()}
                    </div>
                    <div>
                        Until: ${new Date(data.deadline).getDate()}.${new Date(data.deadline).getMonth()}.${new Date(data.deadline).getFullYear()}
                    </div>
                </div>
                <div class="card-body task-description">
                    ${data.description}
                </div>
                <div class="mark-as-done-section ">
                    ${data.status !== 'DONE' ? `<button class="btn btn-primary mt-2" onclick="markAsDone()">
                        Mark as done
                    </button>` : ''}
                </div>
            </div>
        </div>
    `
}