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
import { Plus, Edit, Trash2, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  createdAt: string;
}

export function NewsManagement() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    const stored = localStorage.getItem('newsItems');
    if (stored) {
      setNewsList(JSON.parse(stored));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingNews) {
      // Update existing news
      const updated = newsList.map(item =>
        item.id === editingNews.id
          ? { ...editingNews, ...formData }
          : item
      );
      localStorage.setItem('newsItems', JSON.stringify(updated));
      setNewsList(updated);
      toast.success('News updated successfully!');
    } else {
      // Create new news
      const newItem: NewsItem = {
        id: `news-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...newsList];
      localStorage.setItem('newsItems', JSON.stringify(updated));
      setNewsList(updated);
      toast.success('News created successfully!');
    }

    resetForm();
  };

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setFormData({
      category: news.category,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      date: news.date,
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      const updated = newsList.filter(item => item.id !== id);
      localStorage.setItem('newsItems', JSON.stringify(updated));
      setNewsList(updated);
      toast.success('News deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingNews(null);
    setShowDialog(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>News Management</CardTitle>
              <CardDescription>Create and manage alumni news and announcements</CardDescription>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {newsList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No news articles yet</p>
              <p className="text-sm mb-4">Create your first news article to get started</p>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create News Article
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Excerpt</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsList.map((news) => (
                    <TableRow key={news.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {news.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {news.title}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-md truncate">
                        {news.excerpt}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(news.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(news)}
                            title="Edit News"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(news.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete News"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Edit News Article' : 'Create News Article'}</DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article details' : 'Fill in the details to create a new news article'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Achievement, Community, Education"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Publication Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter news title"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the news article"
                rows={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">This will be shown on the news card</p>
            </div>

            <div>
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full content of the news article (optional)"
                rows={6}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {editingNews ? 'Update News' : 'Create News'}
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
