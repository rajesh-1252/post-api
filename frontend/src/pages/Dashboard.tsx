import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../redux/slice/notificationSlice";
import { RootState } from "../redux/store";
import PostList from "./PostList";


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: RootState) => state.notification);

  const handleCloseSnackbar = () => {
    dispatch(hideNotification());
  };

  return (
    <div>
      <PostList />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};



export default Dashboard;

