import React, { useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import Toaster from "../Toaster";
import { randomAvatar } from "../../utils";

function CreateComment(props) {
  const { postId, refresh } = props;
  const [avatar, setAvatar] = useState(randomAvatar());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});

  const user = getUser();

  const handleSubmit = (event) => {
    event.preventDefault();
    const createCommentForm = event.currentTarget;

    if (createCommentForm.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    const data = {
      author: user.id,
      body: form.body,
      post: postId,
    };

    axiosService
      .post(`/post/${postId}/comment/`, data)
      .then(() => {
        setForm({...form, body: ""});
        setToastMessage("Comment posted successfully🚀");
        setToastType("success");
        refresh();
        setShowToast(true);
      })
      .catch(() => {
        setToastMessage("An error occurred.");
        setToastType("danger");
      });
  };

  return (
    <>
      <Form
        className="d-flex flex-row justify-content-between"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Image
          src={avatar}
          roundedCircle
          width={48}
          height={48}
          className="my-2"
        />
        <Form.Group className="m-3 w-75">
          <Form.Control
            className="py-2 rounded-pill border-primary"
            type="text"
            placeholder="Write a comment"
            value={form.body}
            name="body"
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </Form.Group>
        <div className="m-auto">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={form.body === undefined}
            size="small"
          >
            Comment
          </Button>
        </div>
      </Form>
      <Toaster
        title="Comment!"
        message={toastMessage}
        showToast={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

export default CreateComment;
