import { getAllNovels } from '../../lib/firebase';
import NovelsList from './NovelsList';

export const dynamic = 'force-dynamic';

export default async function NovelsPage() {
  const novels = await getAllNovels();
  return <NovelsList novels={novels} />;
}
