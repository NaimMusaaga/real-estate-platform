import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as conversationsApi from '../../services/api/conversations.api';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { getErrorMessage } from '../../utils/errors';

interface ChatInquiryButtonProps {
  listingId: string;
}

export function ChatInquiryButton({ listingId }: ChatInquiryButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setStarting(true);
    try {
      const conversation = await conversationsApi.startConversation(listingId);
      navigate(`/conversations/${conversation.id}`);
    } catch (err) {
      setError(getErrorMessage(err, 'تعذر بدء المحادثة'));
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <Alert variant="error">{error}</Alert>}
      <Button onClick={handleClick} isLoading={starting} fullWidth size="lg">
        {user ? 'تواصل بخصوص هذا العقار' : 'سجّل الدخول للتواصل مع المعلن'}
      </Button>
    </div>
  );
}
