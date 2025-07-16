import { Link } from 'react-router-dom'
import { Edit, Trash2, Calendar, Clock } from 'lucide-react'
import { useTask } from '../context/TaskContext'

const TaskCard = ({ task }) => {
  const { deleteTask } = useTask()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task._id)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
        {task.updatedAt !== task.createdAt && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Updated: {formatDate(task.updatedAt)}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Link
          to={`/edit/${task._id}`}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

export default TaskCard 