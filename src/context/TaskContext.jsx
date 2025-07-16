import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:5000/api'

const TaskContext = createContext()

const initialState = {
  tasks: [],
  loading: false,
  error: null
}

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks], loading: false }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false
      }
    default:
      return state
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Fetch all tasks
  const fetchTasks = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.get(`${API_URL}/tasks`)
      dispatch({ type: 'SET_TASKS', payload: response.data.data })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    }
  }

  // Create new task
  const createTask = async (taskData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData)
      dispatch({ type: 'ADD_TASK', payload: response.data.data })
      toast.success('Task created successfully!')
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      throw error
    }
  }

  // Update task
  const updateTask = async (id, taskData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData)
      dispatch({ type: 'UPDATE_TASK', payload: response.data.data })
      toast.success('Task updated successfully!')
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      throw error
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await axios.delete(`${API_URL}/tasks/${id}`)
      dispatch({ type: 'DELETE_TASK', payload: id })
      toast.success('Task deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
      throw error
    }
  }

  // Get single task
  const getTask = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${id}`)
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task'
      toast.error(message)
      throw error
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTask
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
} 