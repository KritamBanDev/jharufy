import { useState, useRef, createElement } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  Globe, 
  Users, 
  Lock,
  Smile,
  MapPin,
  Tag,
  AtSign,
  Hash
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStatus } from '../lib/api';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';

// Common emojis for quick access
const commonEmojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😢', '😡', '👍', '❤️', '🔥', '🎉', '🙌', '💯', '🌟', '🎈'];

const CreateStatusModal = ({ isOpen, onClose }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef();
  const textareaRef = useRef();
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [visibility, setVisibility] = useState('friends');
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const visibilityOptions = [
    { value: 'public', icon: Globe, label: 'Public', description: 'Anyone can see this' },
    { value: 'friends', icon: Users, label: 'Friends', description: 'Only your friends can see this' },
    { value: 'private', icon: Lock, label: 'Only Me', description: 'Only you can see this' }
  ];

  const createStatusMutation = useMutation({
    mutationFn: createStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['statusFeed']);
      queryClient.invalidateQueries(['userStatuses']);
      toast.success('Status created successfully!');
      handleClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create status');
    }
  });

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            altText: `Image uploaded by ${authUser?.fullName}`,
            file: file
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImages = await Promise.all(imagePromises);
      setImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
    } catch {
      toast.error('Failed to process images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images to your status');
      return;
    }

    const statusData = {
      content: content.trim(),
      images: images.map(img => ({ url: img.url, altText: img.altText })),
      visibility
    };

    createStatusMutation.mutate(statusData);
  };

  const handleClose = () => {
    setContent('');
    setImages([]);
    setVisibility('friends');
    setShowEmojiPicker(false);
    onClose();
  };

  const addEmoji = (emoji) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      
      // Set cursor position after emoji
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + emoji.length;
        textareaRef.current.focus();
      }, 0);
    } else {
      setContent(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-base-100 pb-2 border-b border-base-200">
            <h3 className="font-bold text-lg sm:text-xl">Create Status</h3>
            <button 
              type="button"
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full">
                <img 
                  src={authUser?.profilePic} 
                  alt={authUser?.fullName}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm sm:text-base truncate">{authUser?.fullName}</div>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-xs gap-1 text-xs sm:text-sm">
                  {createElement(
                    visibilityOptions.find(opt => opt.value === visibility)?.icon || Globe,
                    { className: "h-3 w-3" }
                  )}
                  <span className="capitalize">{visibility}</span>
                  <span className="text-xs">▼</span>
                </div>
                <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-56 sm:w-64">
                  {visibilityOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => setVisibility(option.value)}
                        className={`gap-3 ${visibility === option.value ? 'active' : ''}`}
                      >
                        <option.icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs opacity-70">{option.description}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="form-control mb-4 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${authUser?.fullName?.split(' ')[0]}?`}
              className="textarea border border-base-300 min-h-24 sm:min-h-32 text-base sm:text-lg resize-none pr-12"
              maxLength={2000}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute bottom-3 right-3 btn btn-ghost btn-sm btn-circle"
            >
              <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl z-10 p-3 sm:p-4">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 sm:gap-2 max-h-32 overflow-y-auto">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="btn btn-ghost btn-sm text-lg sm:text-xl hover:bg-base-200 min-h-0 h-8 sm:h-10 p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="label">
              <span className="label-text-alt text-base-content/60 text-xs sm:text-sm">
                {content.length}/2000 characters
              </span>
            </div>
          </div>

          {/* Image Preview - Facebook style */}
          {images.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-base-content/80 mb-2">
                {images.length} {images.length === 1 ? 'image' : 'images'} selected
              </div>
              <div className={`${
                images.length === 1 
                  ? '' // Single image: natural aspect ratio
                  : `grid gap-2 ${
                      images.length === 2 ? 'grid-cols-2' : 
                      images.length === 3 ? 'grid-cols-2' : 
                      'grid-cols-2 sm:grid-cols-3'
                    }`
              } max-h-64 sm:max-h-80 overflow-y-auto`}>
                {images.map((image, index) => {
                  // Single image preview
                  if (images.length === 1) {
                    return (
                      <div key={index} className="relative group">
                        <img 
                          src={image.url} 
                          alt={`Preview ${index + 1}`}
                          className="w-full max-h-48 sm:max-h-64 object-contain rounded-lg border border-base-300 bg-base-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 btn btn-error btn-sm btn-circle opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  }
                  
                  // Multiple images preview
                  const isFirstInThreeGrid = images.length === 3 && index === 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative group ${
                        isFirstInThreeGrid ? 'col-span-2 row-span-2' : ''
                      }`}
                    >
                      <img 
                        src={image.url} 
                        alt={`Preview ${index + 1}`}
                        className={`w-full object-cover rounded-lg border border-base-300 ${
                          isFirstInThreeGrid 
                            ? 'h-32 sm:h-40' // Larger first image in 3-image grid
                            : 'h-20 sm:h-24' // Standard grid images
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 btn btn-error btn-xs btn-circle opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg mb-6">
            <span className="font-medium text-base-content/80">Add to your status</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= 10}
                className="btn btn-ghost btn-sm gap-2 hover:bg-green-100"
                title="Add Photos (Max 10)"
              >
                <ImageIcon className="h-5 w-5 text-green-500" />
                <span className="hidden sm:inline">Photo</span>
                {images.length > 0 && (
                  <span className="badge badge-xs badge-success">{images.length}</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="btn btn-ghost btn-sm gap-2 hover:bg-yellow-100"
                title="Add Emoji"
              >
                <Smile className="h-5 w-5 text-yellow-500" />
                <span className="hidden sm:inline">Emoji</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm gap-2 hover:bg-blue-100"
                title="Add Location (Coming Soon)"
                disabled
              >
                <MapPin className="h-5 w-5 text-blue-500" />
                <span className="hidden sm:inline">Location</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm gap-2 hover:bg-purple-100"
                title="Tag Friends (Coming Soon)"
                disabled
              >
                <AtSign className="h-5 w-5 text-purple-500" />
                <span className="hidden sm:inline">Tag</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="modal-action">
            <button
              type="submit"
              disabled={
                (!content.trim() && images.length === 0) || 
                createStatusMutation.isPending ||
                uploading
              }
              className="btn btn-primary w-full"
            >
              {createStatusMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Status'
              )}
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default CreateStatusModal;
