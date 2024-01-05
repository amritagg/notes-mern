import React, { useState, useContext, useEffect, useRef } from "react";
import noteContext from "../context/notes/noteContext";
import { NoteItem } from "./NoteItem";
import { AddNote } from "./AddNote";
import { useNavigate } from "react-router-dom";

export const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    let navigate = useNavigate();

    const [note, setNote] = useState({
        id: "",
        etitle: "",
        edescription: "",
        etag: "",
    });

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        refClose.current.click();
        props.showAlert("Updated successfully", "success");
    };

    useEffect(() => {
        if (localStorage.getItem("token")) getNotes();
        else {
            navigate("/login");
        }
        getNotes();
        // eslint-disable-next-line
    }, []);

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag,
        });
    };

    const ref = useRef(null);
    const refClose = useRef(null);

    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <button
                type="button"
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                ref={ref}
            >
                Launch demo modal
            </button>

            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1
                                className="modal-title fs-5"
                                id="exampleModalLabel"
                            >
                                Modal title
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label
                                        htmlFor="title"
                                        className="form-label"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        minLength={5}
                                        required
                                        className="form-control"
                                        id="etitle"
                                        name="etitle"
                                        value={note.etitle}
                                        aria-describedby="emailHelp"
                                        onChange={onChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="description"
                                        className="form-label"
                                    >
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="edescription"
                                        minLength={5}
                                        required
                                        value={note.edescription}
                                        name="edescription"
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
                                        id="etag"
                                        value={note.etag}
                                        name="etag"
                                        minLength={5}
                                        required
                                        onChange={onChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                ref={refClose}
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={handleClick}
                                className="btn btn-primary"
                                disabled={
                                    note.etitle.length < 5 ||
                                    note.edescription.length < 5 ||
                                    note.etag.length < 5
                                }
                            >
                                Update Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container row my-3">
                <h2>Your Notes</h2>
                <div className="container">
                    {!notes && notes.length === 0 && "No notes to display"}
                </div>
                {notes.map((note) => {
                    return (
                        <NoteItem
                            key={note._id}
                            note={note}
                            updateNote={updateNote}
                            showAlert={props.showAlert}
                        />
                    );
                })}
            </div>
        </>
    );
};
