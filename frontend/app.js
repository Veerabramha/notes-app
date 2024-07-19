document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    document.getElementById('show-login').addEventListener('click', () => {
      // Show login form
    });
  
    document.getElementById('show-register').addEventListener('click', () => {
      // Show registration form
    });
  
    document.getElementById('new-note').addEventListener('click', () => {
      document.getElementById('note-form').style.display = 'block';
    });
  
    document.getElementById('save-note').addEventListener('click', async () => {
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
      const backgroundColor = document.getElementById('note-bg-color').value;
      try {
        const response = await fetch('http://localhost:3000/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, content, backgroundColor })
        });
        const note = await response.json();
        displayNotes([note]);
      } catch (error) {
        console.error('Error creating note:', error);
      }
    });
  
    document.getElementById('fetch-notes').addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/api/notes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const notes = await response.json();
        displayNotes(notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    });
  
    document.getElementById('fetch-archived-notes').addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/api/notes/archived', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const notes = await response.json();
        displayNotes(notes);
      } catch (error) {
        console.error('Error fetching archived notes:', error);
      }
    });
  
    document.getElementById('fetch-trashed-notes').addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3000/api/notes/trashed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const notes = await response.json();
        displayNotes(notes);
      } catch (error) {
        console.error('Error fetching trashed notes:', error);
      }
    });
  
    function displayNotes(notes) {
      const notesList = document.getElementById('notes-list');
      notesList.innerHTML = '';
      notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.style.backgroundColor = note.backgroundColor;
        noteDiv.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <button class="edit-btn" data-id="${note._id}">Edit</button>
          <button class="delete-btn" data-id="${note._id}">Delete</button>
        `;
        notesList.appendChild(noteDiv);
      });
    }
  });
  