import { useState } from "react";
import NoteContext from "./noteContext";
import { HOST } from "../../Constants";

const NoteState = (props) => {
    const notesIn = [];

    const [notes, setNotes] = useState(notesIn);

    const getNotes = async () => {
        const response = await fetch(`${HOST}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
        });
        const json = await response.json();
        setNotes(json);
    };

    const addNote = async (title, description, tag) => {
        const response = await fetch(`${HOST}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ title, description, tag }),
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    };

    const deleteNote = async (id) => {
        await fetch(`${HOST}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
        });
        const newNotes = notes.filter((note) => {
            return note._id !== id;
        });
        setNotes(newNotes);
    };

    const editNote = async (id, title, description, tag) => {
        await fetch(`${HOST}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ title, description, tag }),
        });

        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
            if (newNotes[index]._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    };

    return (
        <NoteContext.Provider
            value={{ notes, getNotes, addNote, deleteNote, editNote }}
        >
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
