import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, CircularProgress
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CrudTable = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);  // New state for loader

  // Fetch items from the database
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://crud-backend-ten-mu.vercel.app/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open dialog to add a new item or edit existing one
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '' });
    setEditMode(false);
    setLoading(false);  // Reset loading when dialog is closed
  };

  // Add a new item
  const handleAdd = async () => {
    setLoading(true);  // Start loading
    try {
      await axios.post('https://crud-backend-ten-mu.vercel.app/api/items', formData);
      fetchItems();  // Refresh the items list
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Update an existing item
  const handleEdit = async () => {
    setLoading(true);  // Start loading
    try {
      await axios.put(`https://crud-backend-ten-mu.vercel.app/api/items/${editId}`, formData);
      fetchItems();
      handleClose();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Delete an item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://crud-backend-ten-mu.vercel.app/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Open edit dialog
  const handleEditClick = (item) => {
    setFormData({ name: item.name, description: item.description });
    setEditId(item._id);
    setEditMode(true);
    setOpen(true);
  };

  return (
    <div>
      <h2>
        Crud App 
      </h2>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Item
      </Button>

      {/* Table to display items */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item._id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding or Editing Items */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={editMode ? handleEdit : handleAdd} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (editMode ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrudTable;
