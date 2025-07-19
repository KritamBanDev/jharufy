import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpenIcon,
  CalendarIcon,
  CameraIcon,
  EditIcon,
  GlobeIcon,
  HeartIcon,
  MapPinIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  ShareIcon,
  StarIcon,
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Components
import { PageLoader } from '@/components';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileTabs } from './components/ProfileTabs';
import { StatusPost } from './components/StatusPost';
import { LanguageInfo } from './components/LanguageInfo';
import { QuickStats } from './components/QuickStats';

// Hooks & Utils
import { useAuthStore } from '@/store/authStore';
import { getUserProfile, getStatusesByUser } from '@/lib/api';
import { safeFormatDistanceToNow } from '@/utils/dateUtils';

export { ProfilePage as default } from './ProfilePage';
