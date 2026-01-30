import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: string;
  description: string;
  image: string;
  createdAt: string;
}

export function EventsManagement() {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    attendees: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const stored = localStorage.getItem('eventsItems');
    if (stored) {
      setEventsList(JSON.parse(stored));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      // Update existing event
      const updated = eventsList.map(item =>
        item.id === editingEvent.id
          ? { ...editingEvent, ...formData }
          : item
      );
      localStorage.setItem('eventsItems', JSON.stringify(updated));
      setEventsList(updated);
      toast.success('Event updated successfully!');
    } else {
      // Create new event
      const newItem: EventItem = {
        id: `event-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...eventsList];
      localStorage.setItem('eventsItems', JSON.stringify(updated));
      setEventsList(updated);
      toast.success('Event created successfully!');
    }

    resetForm();
  };

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      attendees: event.attendees,
      description: event.description,
      image: event.image,
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updated = eventsList.filter(item => item.id !== id);
      localStorage.setItem('eventsItems', JSON.stringify(updated));
      setEventsList(updated);
      toast.success('Event deleted successfully!');
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL events? This action cannot be undone.')) {
      localStorage.setItem('eventsItems', JSON.stringify([]));
      setEventsList([]);
      toast.success('All events deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      attendees: '',
      description: '',
      image: '',
    });
    setEditingEvent(null);
    setShowDialog(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Create and manage alumni events and gatherings</CardDescription>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {eventsList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No events scheduled yet</p>
              <p className="text-sm mb-4">Create your first event to get started</p>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsList.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {event.title}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {event.date}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {event.location}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {event.attendees}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event)}
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Events
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event details' : 'Fill in the details to create a new event'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Annual Alumni Reunion"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., June 15, 2024"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter date in any format</p>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Main Campus"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="attendees">Expected Attendees *</Label>
              <Input
                id="attendees"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                placeholder="e.g., 500+ Expected"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the event (optional)"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg (optional)"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use a default image</p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}