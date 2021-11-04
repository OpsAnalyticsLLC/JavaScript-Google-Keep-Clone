class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = '';
        this.text = '';
        this.id = '';
         //Denote HTML elements with a dollar sign on the front of the variale name
        this.$notes = document.querySelector('#notes')
        this.$placeHolder = document.querySelector("#placeholder");
        this.$form = document.querySelector("#form");  //you make reference to the form's id in the GKIndex
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");
        this.$formButtons = document.querySelector("#form-buttons");  
        this.$formCloseBotton = document.querySelector("#form-close-button"); 
        this.$modal = document.querySelector('.modal');
        this.$modalTitle = document.querySelector('.modal-title');
        this.$modalText = document.querySelector('.modal-text');
        this.$modalCloseButton = document.querySelector('.modal-close-button');
        this.$colorTooltip = document.querySelector('#color-tooltip');
        this.renderNotes(); 
        this.addEventListeners();  //You want to run the event listerners when the app starts up 
    }

    addEventListeners() {  //This is going to be the general place to add events listeners for all interactions the user makes
        document.body.addEventListener('click', event => {  //EVENT 1: Add the main methods 
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
            this.deleteNote(event);
        });

        document.body.addEventListener('mouseover', event => {
            this.openToolTip(event);
        });

        document.body.addEventListener('mouseout', event => {
            this.closeToolTip(event);
        });

        this.$colorTooltip.addEventListener('mouseover', function() {
            this.style.display = 'flex';  
        });
          
        this.$colorTooltip.addEventListener('mouseout', function() {
            this.style.display = 'none'; 
        });

        this.$colorTooltip.addEventListener('click', event => {
            const color = event.target.dataset.color; 
            if (color) {
                this.editNoteColor(color);  
            }
        });

        this.$form.addEventListener('submit', event => {  //EVENT 2: You need a different event listener for the form itself 
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text
            if (hasNote) {
                this.addNote({title, text});
            }
        });

        this.$formCloseBotton.addEventListener('click', event => {  //EVENT 3: form close button 
            event.stopPropagation();
            this.closeForm();
        });

        this.$modalCloseButton.addEventListener('click', event => {  //EVENT 4: editing form button 
            this.closeModal(event);
        })
    }

    handleFormClick(event) {  //This the function that handles clicks on the forms 
        const isFormClicked = this.$form.contains(event.target);
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text
        if (isFormClicked) {
            this.openForm();
        } else if (hasNote) {
            this.addNote({title, text});
        } else {
            this.closeForm();
        }
    }

    openForm() {  //To add the toggle appearance of openning a form we're going to reference the css style in GKAssetts. There's a class there called form-open 
        this.$form.classList.add('form-open')  //you will also want to see the note's title text currently hiding as well as the submit and close buttons 
        this.$noteTitle.style.display = 'block';
        this.$formButtons.style.display = 'block';
    }

    closeForm() {  //To add the toggle appearance of closing a form we're going to reference the css style in GKAssetts. There's a class there called form-open 
        this.$form.classList.remove('form-open')
        this.$noteTitle.style.display = 'none';
        this.$formButtons.style.display = 'none';
        this.$noteText.value = '';
        this.$noteTitle.value = '';
    }

    openModal(event) {
        if (event.target.matches('.toolbar-delete')) return;

        if (event.target.closest('.note')) {
            this.$modal.classList.toggle('open-modal');
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal(event) {
        this.editNote();
        this.$modal.classList.toggle('open-modal');
    }

    openToolTip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.id = event.target.dataset.id;
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left + window.scrollX;
        const vertical = (noteCoords.top + window.scrollY);
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
        this.$colorTooltip.style.display = 'flex';
    }

    closeToolTip(event) {
        if (!event.target.matches('.toolbar-color')) return;
        this.$colorTooltip.style.display = 'none';  
    }

    addNote({title, text}) {  //This is the function to add a new note to the list of notes 
        const newNote = {
            title,
            text,
            color: 'white',
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1 
        };
        this.notes = [...this.notes, newNote];
        this.renderNotes();
        this.closeForm();
    }

    deleteNote(event) {
        event.stopPropagation();
        if (!event.target.matches('.toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.renderNotes();
    }

    editNote() {
        const title = this.$modalTitle.value;
        const text = this.$modalText.value;
        this.notes = this.notes.map(note =>
            note.id === Number(this.id) ? {...note, title, text} : note
            );
        this.renderNotes();
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note =>
          note.id === Number(this.id) ? { ...note, color } : note
        );
        this.renderNotes();
    }

    selectNote(event) {
        const $selectedNote = event.target.closest('.note');
        if (!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children;
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id;
    }

    renderNotes() {
        this.saveNotes();
        this.displayNotes();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0;
        this.$placeHolder.style.display = hasNotes ? 'none' : 'flex';  
        this.$notes.innerHTML = this.notes.map(note => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
            <div class="${note.title && 'note-title'}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
                <div class="toolbar">
                <img class="toolbar-color" data-id=${note.id} src="https://icon.now.sh/palette">
                <img class="toolbar-delete" data-id=${note.id} src="https://icon.now.sh/delete">
                </div>
            </div>
        </div>`).join("");  //you need this .join() in order to avoid commas being shown in the app 
        // if (hasNotes) {
        //     this.$placeHolder.style.display = 'none'
        // } else{
        //     this.$placeHolder.style.display = 'flex'
        // }
    }
}

new App()