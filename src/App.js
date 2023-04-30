import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css'
function ContactList() {
const [contacts, setContacts] = useState([]);
const [editingContact, setEditingContact] = useState(null);


const [newContact, setNewContact] = useState({ name: '', email: '',phone: ''})

useEffect(() => {
    axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
        setContacts(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
}, []);

const handleDelete = (id) => {
    axios
    .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then(() => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    })
    .catch((error) => {
    console.log(error);
    });
};

const handleEdit = (contact) => {
    setEditingContact(contact);
};



const handleSave = (updatedContact) => {
    axios
    .put(
    `https://jsonplaceholder.typicode.com/users/${updatedContact.id}`,
    updatedContact
        )
    .then((response) => {
        setContacts(
        contacts.map((contact) =>
            contact.id === updatedContact.id ? response.data : contact
        )
        );
        setEditingContact(null);
    })
    .catch((error) => {
        console.log(error);
    });
};

//create contact

const handleInputChange = e => {
        setNewContact({
            ...newContact,
            [e.target.name]: e.target.value
        });
    };


const createContact = e => {
    e.preventDefault();
    axios.post('https://jsonplaceholder.typicode.com/users', newContact)
    .then(response => {
        setContacts([...contacts, response.data]);
        setNewContact({ name: '', email: '', phone: '' });
    })
    .catch(error => console.log(error));
}


return (
    <div className="contact-list-container" style={{backgroundColor : "darkcyan"}} > {/* Add a container div */}

        <h1 >Create Contact</h1>
        <form onSubmit={createContact}>
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={newContact.name}
                onChange={handleInputChange}
                required
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                value={newContact.email}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={newContact.phone}
                onChange={handleInputChange}
                required
            />
            <button   style={{backgroundColor : "black"}}type="submit">Add Contact</button>
        </form>

        <h1 >Contact List</h1>
        <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {contacts.map((contact) => (
            <tr key={contact.id}>
            {editingContact && editingContact.id === contact.id ? (
            <>
            <td>
                <input
                    type="text"
                    value={editingContact.name}
                        onChange={(e) =>
                            setEditingContact({
                            ...editingContact,
                            name: e.target.value,
                        })
                    }
                />
            </td>

            <td>
                <input
                    type="email"
                    value={editingContact.email}
                        onChange={(e) =>
                            setEditingContact({
                            ...editingContact,
                            email: e.target.value,
                        })
                    }
                />
            </td>
            <td>
                <input
                    type="text"
                    value={editingContact.phone}
                    onChange={(e) =>
                        setEditingContact({
                            ...editingContact,
                            phone: e.target.value,
                        })
                    }
                />
            </td>
            <td>
            <button  style={{backgroundColor : "black"}}
                onClick={() => handleSave(editingContact)}
                disabled={!editingContact.name || !editingContact.email}
            >
                Save
            </button>
            <button  style={{backgroundColor : "black"}} onClick={() => setEditingContact(null)}>Cancel</button>
            </td>
            </>

                ) : (
            <>

                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
            <td>
                <button style={{backgroundColor : "blue"}} onClick={() => handleEdit(contact)}>Edit</button>
                <button style={{backgroundColor : "red"}} onClick={() => handleDelete(contact.id)}>Delete</button>
                </td>
            </>
            )}
            </tr>
            ))}
        </tbody>
        </table>
        </div>
    );
}

export default ContactList;