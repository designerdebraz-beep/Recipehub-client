"use client";

import { authClient } from "@/lib/auth-client";
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { User } from "lucide-react";

export  function  FormModel() {

    const onSubmit = async (e)=>{
       e.preventDefault();
       const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const image = formData.get("image");

    await authClient.updateUser({
    image,
    name
})
 

    }

    return (
        <Modal>
            <Button className="bg-blue-600 hover:bg-blue-700 text-center">Updated Profile</Button>
            <Modal.Backdrop>
                <Modal.Container placement="auto">
                    <Modal.Dialog className="sm:max-w-md">
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                                <User className="size-5" />
                            </Modal.Icon>
                            <Modal.Heading>Updated your profile</Modal.Heading>
                           
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            <Surface >
                                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                                    <TextField className="w-full" name="name" type="text" variant="secondary">
                                        <Label>Name</Label>
                                        <Input placeholder="Enter your name" />
                                    </TextField>
                                    <TextField className="w-full" name="image" type="url" variant="secondary">
                                        <Label>Image</Label>
                                        <Input placeholder="Enter your image Url" />
                                    </TextField>

                                    <Modal.Footer>
                                        <Button slot="close" variant="secondary">
                                            Cancel
                                        </Button>
                                        <Button type='submit' slot="close">Save</Button>
                                    </Modal.Footer>

                                </form>
                            </Surface>
                        </Modal.Body>

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}