document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // detect submission
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // display compose  & bar other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-content-view').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


//check details
function viewEmail(id) {
  fetch(`/emails/${id}`) 
  .then(response=> response.json())
  .then(email=> { 
   //emails
  console.log(email);
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-content-view').style.display = 'block';

  document.querySelector('#emails-content-view').innerHTML = `
   
  <ul>
    <ul class="list-group">
    <li class="list-group-item active"><strong>From:</strong>${email.sender}</li>
    <li class="list-group-item"><strong>To:</strong>${email.recipients}</li>
    <li class="list-group-item"><strong>Subject:</strong>${email.subjct}</li>
    <li class="list-group-item"><strong>Timestamp:</strong>${email.timestamp}</li>
    <li class="list-group-item">${email.body}</li>
  </ul>
  `

  // visited and unvisited emails
  if(!email.read){   
    fetch(`/emails/${email.id}`, {
      method:'PUT',
      body:JSON.stringify({ 
      read:true
      })
          
    })          
  }   
//Archive
  
const archive1= document.createElement('button');
archive1.innerHTML= email.archived ? "Unarchive": "Archive";
archive1.className= email.archived ? "btn btn-info": "btn btn-danger";
archive1.addEventListener('click', function(){
  fetch(`/emails/${email.id}`, {
      method:'PUT',
      body:JSON.stringify({ 
        archived:!email.archived
      })
    })

  .then(() => { load_mailbox('archive')})
   
  });
  document.querySelector('#emails-content-view').append(archive1);




  

 //Reply
 const reply1= document.createElement('button');
 reply1.innerHTML= "Reply";
 reply1.className=  "btn btn-success";
 reply1.addEventListener('click', function(){
   compose_email();
   document.querySelector('#compose-recipients').value = email.sender;
   var subject= subject;
   if(subject.split('',1)[0] !="Re:"){
     subject= "Re:" + email.subject;
      }
   document.querySelector('#compose-subject').value = subject;
   document.querySelector('#compose-body').value = `Sent ${email.timestamp} by:  ${email.sender} message: ${email.body}`;
 
    });
  document.querySelector('#emails-content-view').append(reply1);

  });
}

 

function load_mailbox(mailbox) {
  
  // display the mailbox & bar other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-content-view').style.display = 'none';

  // display mailbox 
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  //retrieve data
   fetch(`/emails/${mailbox}`) 
   .then(response=> response.json())
   .then(emails=> { 
    //create a loop
   emails.forEach(singleEmail=> { 


   console.log(singleEmail);
   //make container
   const newEmail = document.createElement('div');
   newEmail.className="list-group-item";
   newEmail.innerHTML = `
   <h4>Sender:${singleEmail.sender}</h4>
   <p>Subject:${singleEmail.subject}</p>
   <p style= "color:skyblue">${singleEmail.timestamp}</p>
   `
   //visited and unvisited emails
   newEmail.className=singleEmail.read? 'read':'unread';
   
  
  //when clicked
  newEmail.addEventListener('click', function() {
    viewEmail(singleEmail.id)
  }); 
  document.querySelector('#emails-view').append(newEmail);
    })  
  });
} 


function send_email(event) {
  event.preventDefault();

  // display fields
  recipients = document.querySelector('#compose-recipients').value 
  subject = document.querySelector('#compose-subject').value 
  body = document.querySelector('#compose-body').value 


   //retrieve data
   fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
} 
  
 

  
  



