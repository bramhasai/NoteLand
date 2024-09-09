let notes=[];
let right=document.querySelector('.right');
let notes_div=document.querySelector('.notes');


function initializeNotes() {
  const storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    try {
      notes = JSON.parse(storedNotes);
      if (!Array.isArray(notes)) {
        notes = []; // Reset if it's not an array
      }
      //else it is array
    } catch (e) {
      notes = []; // Reset if parsing fails
    }
  }
}

document.querySelector('#newNote').addEventListener("click",()=>{
    document.querySelector('.one').style.display='none';
    document.querySelector('.three')?.remove(); 
    document.querySelector('.task_div')?.remove();//to remove if task div is present
    document.querySelector('.two').style.display='flex';
})

document.querySelector('#createNote').addEventListener('click',()=>{
  let note={
    title:document.querySelector('#Notetext').value,
    textArea:document.querySelector('#text_area').value,
    NewTasks:[],
  };
  if((note.title).trim()==="" || (note.textArea).trim()===''){
    alert("Empty Notes cannot be added");
    return;
  }
  let unique_Id="note"+Math.floor(Math.random()*1000);
  addtoLocalStorage(note,unique_Id);
  render(note,unique_Id);
  document.querySelector('.two').style.display='none';
  toggleDisplayNotes();
});

function render(note,unique_Id){
  let note_div=document.createElement('div');
  note_div.classList.add('note',unique_Id);
  let note_title=document.createElement('h4');
  let note_text=document.createElement('p');

  let text=note.textArea;
  const words=text.split(" ");
  const description=words.slice(0,WordLimit()).join(" ")+"...";
  console.log(description);
  note_title.innerText=note.title;
  note_text.innerText=description;
  note_div.appendChild(note_title);
  note_div.appendChild(note_text);
  notes_div.append(note_div);
  document.querySelector('#Notetext').value='';
  document.querySelector('#text_area').value='';

  note_div.addEventListener('click',()=>displayEditing(note,unique_Id));
}


function displayEditing(note,unique_Id){
  document.querySelector('.task_div')?.remove();//to remove if task div is present
  document.querySelector('.three')?.remove();
  document.querySelector('.two').style.display='none';
  let threeDiv = document.createElement('div');
  threeDiv.className = 'three';
  threeDiv.innerHTML=`
    <div class="top">
      <h3>${note.title}</h3>
      <div class="buttons">
        <button id="addTask">Add Task</button>
        <button id="deleteNote">Delete</button>
        <button id="Submit">Submit</button>
      </div>
    </div>
    <div class="textSpace">
      <textarea name="edit_text" id="edit_text">${note.textArea}</textarea>
      <div class="tasks_display"></div>
    </div>`;
    right.append(threeDiv); 
    document.querySelector("#addTask").addEventListener("click",()=>{
      addTasks(note,unique_Id);
    })
    document.querySelector("#deleteNote").addEventListener("click",()=>{
      NoteDelete(note,unique_Id);
    });
    document.querySelector("#Submit").addEventListener("click",()=>{
      submitNote(note,unique_Id);
      document.querySelector('.three')?.remove();
    });

    let tasks_list=threeDiv.querySelector('.tasks_display')
    if(note.NewTasks.length>0){
      tasks_list.innerHTML = "<h3>Tasks</h3>";
      note.NewTasks.forEach((task,index)=>{
        const taskItem=document.createElement('div');
        taskItem.className="task_item";
        taskItem.innerHTML=`
        <input type="checkbox" id="task_${unique_Id}_${index}" ${task.taskStatus ? 'checked':""}>
        <label for="task_${unique_Id}_${index}">${task.taskName}</label>
        `;
        tasks_list.appendChild(taskItem);
        const checkbox=document.getElementById(`task_${unique_Id}_${index}`);
        checkbox.addEventListener('change',()=>{
          task.taskStatus=checkbox.checked;
          localStorage.setItem('notes',JSON.stringify(notes));
        });
      });
    } 
    else{
      tasks_list.innerHTML="<p>No tasks available.</p>";
    }
}

function addTasks(note,unique_Id){
  const task_div=document.createElement('div');
  task_div.className='task_div';

  let input_task_div=document.createElement('div');
  input_task_div.className="input_task_div"

  let input_task=document.createElement('input');
  input_task.id="input_task";
  input_task.type='text';
  input_task.placeholder="TASK NAME";

  let button_div=document.createElement('div');
  button_div.className='button_taskdiv';

  let task_submit=document.createElement('button');
  task_submit.id='submit_task';
  task_submit.innerText="Create Task"

  let task_cancel = document.createElement('button');
  task_cancel.id = 'cancel_task';
  task_cancel.innerText = "Cancel";

  button_div.appendChild(task_submit);
  button_div.appendChild(task_cancel);


  input_task_div.appendChild(input_task)
  task_div.appendChild(input_task_div);
  task_div.appendChild(button_div);
  right.append(task_div);

  task_submit.addEventListener("click",()=>{
    if((input_task.value).trim()!==''){
      let task={
        taskName:input_task.value,
        taskStatus:false
      };
      note.NewTasks.push(task);
      console.log(notes);
      localStorage.setItem('notes',JSON.stringify(notes));
      task_div.remove();
      displayEditing(note, unique_Id);
    }
    else{
      alert("Task cannot be empty");
    }
  })
  task_cancel.addEventListener("click", () => {
    task_div.remove();
    mainContent.classList.remove();
  });
}


function NoteDelete(note,unique_Id){
  document.querySelector('.task_div')?.remove();//to remove if task div is present
  notes=notes.filter(note=>note.unique_Id!==unique_Id);
  localStorage.setItem('notes',JSON.stringify(notes));
  document.querySelector("."+unique_Id).remove();
  document.querySelector(".three").remove();
  alert(note.title+" deleted");
  toggleDisplayNotes();
}

function submitNote(note,unique_Id){
  note.textArea=document.querySelector('#edit_text').value;
  localStorage.setItem('notes',JSON.stringify(notes));
  let note_ele=document.querySelector(`.note.${unique_Id}`);
  if(note_ele){
    let noteText=note_ele.querySelector('p');
    let text=note.textArea;
    const words=text.split(" ");
    const description=words.slice(0,WordLimit()).join(" ")+"...";
    noteText.textContent=description;
  }
  
  alert("Notes saved successfully");
}


function addtoLocalStorage(note,unique_Id){
  if((note.title).trim()!="" && (note.textArea).trim()!=""){
    note={...note,unique_Id};
    notes.push(note);
    localStorage.setItem('notes',JSON.stringify(notes));
  }
}

function renderafterRefresh(){
  initializeNotes();
  notes.forEach(note=>{
    render(note,note.unique_Id);
  })
}

function toggleDisplayNotes(){
  let divOne=document.querySelector('.one');
  if (notes.length === 0) {
      divOne.style.display = 'block'; 
  } else {
      divOne.style.display = 'none'; 
  }
}

function WordLimit() {
  if (window.innerWidth >= 350 && window.innerWidth <= 500) {
      return 5; 
  } else if (window.innerWidth > 500 && window.innerWidth < 700) {
      return 8; 
  }else if (window.innerWidth >= 700 && window.innerWidth <= 900) {
    return 4; 
  }else if (window.innerWidth > 900 && window.innerWidth <= 1200) {
      return 6;
  } 
  else {
      return 6;
  }
}

initializeNotes();
renderafterRefresh();
toggleDisplayNotes();

