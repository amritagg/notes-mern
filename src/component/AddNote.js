import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

export const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({
        title: "",
        description: "",
        tag: "General",
    });

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({
            title: "",
            description: "",
            tag: "General",
        });
        props.showAlert("Added successfully", "success");
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        aria-describedby="emailHelp"
                        minLength={5}
                        required
                        value={note.title}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        minLength={5}
                        required
                        value={note.description}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">
                        Tag
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={note.tag}
                        id="tag"
                        name="tag"
                        onChange={onChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleClick}
                    disabled={
                        note.title.length < 5 ||
                        note.description.length < 5 ||
                        note.tag.length < 5
                    }
                >
                    Add Note
                </button>
            </form>
        </div>
    );
};
