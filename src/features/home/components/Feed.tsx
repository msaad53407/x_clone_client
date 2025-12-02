import { PostCard } from './PostCard';

export function Feed() {
  const posts = [
    {
      id: 1,
      name: 'Mario Nawfal',
      username: '@MarioNawfal',
      avatar: 'https://github.com/shadcn.png', // Placeholder
      time: '5h',
      content:
        '🇺🇸 SAM ALTMAN JUST HIT "CODE RED" - AND BIG TECH FINALLY SMELLS BLOOD\n\nOpenAI just threw the emergency lever.\n\nSam Altman - the man who spent the last 2 years looking untouchable - told his staff this week that the AI crown is no longer guaranteed.',
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWl8ZW58MHx8MHx8fDA%3D',
      comments: 85,
      reposts: 37,
      likes: 618,
      views: '98K'
    },
    {
      id: 2,
      name: 'mary morgan',
      username: '@maryarchived',
      avatar: 'https://github.com/shadcn.png', // Placeholder
      time: '15h',
      content:
        "this is so cowardly but unfortunately an omen for what's to come from hollywood going forward. authorial intent takes a backseat to algorithmically enhanced, crowdsourced, fan-service slop. have some artistic integrity and come up with A STORY. no wonder this cost $60M an episode",
      comments: 120,
      reposts: 45,
      likes: 1200,
      views: '150K'
    },
    {
      id: 3,
      name: 'DiscussingFish',
      username: '@DiscussingFish',
      avatar: 'https://github.com/shadcn.png', // Placeholder
      time: 'Dec 1',
      content:
        'The Duffer Brothers say they shot 3 endings to the \'STRANGER THINGS\' series finale, and the version you watch will be randomized from household-to-household.\n\nEnding #2 reportedly "Canonizes a long-time internet fan theory."',
      comments: 500,
      reposts: 200,
      likes: 5000,
      views: '1M'
    }
  ];

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
