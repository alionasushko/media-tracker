import Rating from '@/shared/components/ui/Rating';
import Cover from '@/features/media/components/Cover';
import { UserMedia } from '@/features/media/types';
import { Card } from 'react-native-paper';

const MediaCard = ({ item, onPress }: { item: UserMedia; onPress?: () => void }) => {
  return (
    <Card onPress={onPress}>
      <Cover path={item.coverUrl} />
      <Card.Title title={item.title} subtitle={`${item.type} • ${item.status}`} />
      {typeof item.rating === 'number' && item.rating > 0 ? (
        <Card.Content>
          <Rating value={item.rating} />
        </Card.Content>
      ) : null}
    </Card>
  );
};

export default MediaCard;
