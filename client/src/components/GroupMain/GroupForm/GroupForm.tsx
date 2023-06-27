import { FormEvent, useState } from "react";
import "./GroupForm.css";
import SuccessPopup from "../SuccessPopup/SuccessPopup";

type Props = {
  endpoint: string;
  createGroup: boolean;
};

type popupData = {
  message: string;
  invite_code: string;
  groupName: string;
};

function GroupForm({ endpoint, createGroup }: Props) {
  const [groupInfo, setGroupInfo] = useState<string | null>();
  const [popupData, setPopupData] = useState<popupData>();
  const [showPopup, setShowPopup] = useState<boolean>();

  function onSubmitHandler(e: FormEvent) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName: groupInfo,
        admin: localStorage.getItem("uid"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPopupData({
            message: data.message,
            invite_code: data.invite_code,
            groupName: data.groupName,
          });
          setShowPopup(true);
        }
        console.log("Message:", data);
      })
      .catch((error) => {
        console.error("Backend request failed:", error);
      });
  }
  return (
    <>
      {showPopup && (
        <SuccessPopup
          message={popupData?.message as string}
          invite_code={popupData?.invite_code as string}
          groupName={popupData?.groupName as string}
        />
      )}
      <form action="/" method="POST" className="create-group-form">
        <h2 className="create-group-heading">
          {createGroup ? "Create a New Group" : "Join a Group"}
        </h2>
        <div className="form-item">
          <label htmlFor="group-info">
            Group {createGroup ? "Name" : "Code"}
          </label>
          <input
            onChange={(e) => {
              setGroupInfo(e.target.value);
            }}
            type="text"
            name="group-info"
            id="group-info"
            value={groupInfo as string}
            placeholder={createGroup ? "Dubai Trip" : "25BH3210"}
          />
        </div>
        <button
          type="submit"
          className="get-started-btn"
          onClick={(e) => onSubmitHandler(e)}
        >
          {createGroup ? "Get Started" : "Join the Group"}
        </button>
      </form>
    </>
  );
}

export default GroupForm;
