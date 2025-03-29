import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { showNotification } from './notificationSlice';

axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export interface Post {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
}

interface ErrorResponse {
  msg: string;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean,
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
};


export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page, append = false }: { page: number; append?: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/posts', {
        params: {
          page,
          limit: 10
        }
      });

      return {
        posts: response.data.result.posts,
        hasMore: response.data.result.hasMore,
        append
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message || 'Failed to fetch posts');
      }
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(showNotification({ message: 'Post created successfully!', severity: 'success' }));
      return response.data.result;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      dispatch(showNotification({
        message: axiosError.response?.data?.msg || 'Failed to create post',
        severity: 'error'
      }));
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }: { id: string, postData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`/posts/${id}`, postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(showNotification({ message: 'Post updated successfully!', severity: 'success' }));
      return response.data.result;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      dispatch(showNotification({
        message: axiosError.response?.data?.msg || 'Failed to update post',
        severity: 'error'
      }));
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/posts/${id}`);
      dispatch(showNotification({ message: 'Post deleted successfully!', severity: 'success' }));
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      dispatch(showNotification({
        message: axiosError.response?.data?.msg || 'Failed to delete post',
        severity: 'error'
      }));
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          state.posts = action.payload.posts;
        }
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      });
  },
});

export default postSlice.reducer;
