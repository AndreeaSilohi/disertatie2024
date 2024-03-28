import React, {
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { useNavigate ,useParams} from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Button } from "@mui/material";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function UserEditScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          isAdmin,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      window.alert("User updated successfully");

      navigate("/admin/users");
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <div className="edit-screen-container">
      <div>
        <Navbar />
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="product-edit-form">
          <h1>Edit user</h1>
          <form onSubmit={submitHandler} className="form-alignment">
            <div className="form-product-edit-content">
              <input
                className="input-field"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input-field"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="checkbox"
                className="input-field"
                name="isAdmin"
                checked={isAdmin} // Assuming email is a boolean value determining whether the checkbox is checked or not
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <Button
                disbled={loadingUpdate}
                type="submit"
                // onClick={() => deleteHandler(order)}
              >
                Update
              </Button>
              {loadingUpdate&& <LoadingBox></LoadingBox>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
