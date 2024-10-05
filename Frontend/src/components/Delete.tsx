import { Button, Form } from "react-bootstrap"
import CustomFormGroup from "./FormGroup/FormGroup"
import { useState } from "react"
import { deleteAccount } from "../services/AdminService"

const Delete:React.FC = () =>{
    const[userId,setUserId]=useState("")
    const handleChange = (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const { name, value } = e.target;
        setUserId(value);
      };
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        deleteAccount(userId,"")
      };
    return(
        <Form>
             <CustomFormGroup
             
      label="userId"
      type="text"
      placeholder="Enter UserId"
      id="userId"
      name="userId"
      disabled={false}
      required={true}
      value={userId}
      onChange={handleChange}
    />
    <Button type="submit" onClick={handleSubmit}>
        submit
    </Button>
        </Form>
      
    )
}



export default Delete