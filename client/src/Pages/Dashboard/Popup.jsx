import React,{useState} from 'react';
import axios from 'axios';
import './Dashboard.css';
import "bootstrap";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Popup(props){

    const [description,setDescription] = useState("");
    const [currentFile, setCurrentFile] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;
    const handleDescriptionChange = (event) => {
        event.preventDefault();
        const newDescription= event.target.value;
        setDescription(newDescription);
    }
    const handleFileChange = (event) => {
        setCurrentFile(event.target.files[0]);
    }
    const handleClose = () => {
        props.setShow(false);
    }
    const submitFunction = async (event) => {
        event.preventDefault();
        props.setShow(false);
        const formData = new FormData();
        formData.append('picture',currentFile);
        formData.append('description',description);
        formData.append('userId',userId);
        formData.append('picturePath',currentFile.name);
        try{
            await axios.post( `http://localhost:3001/posts/`,formData, {
                        headers: {
                            'Authorization' : "Bearer " + localStorage.getItem('token').slice(1,-1),
                            'Content-Type' : 'multi/form-data',
                        },
                    });
            alert("post created successfully");
            setDescription("");
        } catch(error){
            console.log(error);
        }

    };
    return(
        <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div >
                <label htmlFor='fname'></label>
                <input 
                    className='input'
                    value = {description}
                    type = "text"
                    placeholder = "write the description"
                    onChange = {handleDescriptionChange}
                    required
                />

            </div>
                <div>
                    <input 
                    type="file" 
                    onChange={handleFileChange}
                    required />
                </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitFunction}>
            Submit Post
          </Button>
        </Modal.Footer>
      </Modal>);
}

export default Popup;