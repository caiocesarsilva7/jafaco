package com.caiodev.jafaco.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.caiodev.jafaco.dto.TaskDTO;
import com.caiodev.jafaco.model.Task;
import com.caiodev.jafaco.model.User;
import com.caiodev.jafaco.repository.TaskRepository;
import com.caiodev.jafaco.repository.UserRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<TaskDTO> getAllTasksForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserId(currentUser.getId());
        
        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TaskDTO getTaskById(Long id) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Task not found"));
        
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to access this task");
        }
        
        return convertToDTO(task);
    }
    
    public TaskDTO createTask(TaskDTO taskDTO) {
        User currentUser = getCurrentUser();
        
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setCompleted(taskDTO.isCompleted());
        task.setDueDate(taskDTO.getDueDate());
        task.setUser(currentUser);
        
        Task savedTask = taskRepository.save(task);
        
        return convertToDTO(savedTask);
    }
    
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        User currentUser = getCurrentUser();
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Task not found"));
        
        if (!existingTask.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to modify this task");
        }
        
        existingTask.setTitle(taskDTO.getTitle());
        existingTask.setDescription(taskDTO.getDescription());
        existingTask.setCompleted(taskDTO.isCompleted());
        existingTask.setDueDate(taskDTO.getDueDate());
        
        Task updatedTask = taskRepository.save(existingTask);
        
        return convertToDTO(updatedTask);
    }
    
    public void deleteTask(Long id) {
        User currentUser = getCurrentUser();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityExistsException("Task not found"));
        
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to delete this task");
        }
        
        taskRepository.delete(task);
    }
    
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }
        return user;
    }
    
    private TaskDTO convertToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(task.getId());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setCompleted(task.isCompleted());
        taskDTO.setDueDate(task.getDueDate());
        taskDTO.setCreatedAt(task.getCreatedAt());
        return taskDTO;
    }
}