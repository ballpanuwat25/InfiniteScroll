import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef();

  const dataImages = `https://source.unsplash.com/random`;

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;

      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 20
      ) {
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    getData();
  }, [page]);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://api.sampleapis.com/codingresources/codingResources');
      setData((prevData) => [...prevData, ...res.data]);
      setHasMore(res.data.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} style={{ overflowY: 'auto', height: '100vh' }}>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-3 gap-3'>
        {data.map((item, index) => (
          <div className='border-2 rounded p-3 hover:border-red-400 transition transition-colors duration-150' key={item.id}>
            <img src={dataImages + `/sig=${item.id}`} alt={item.title} className='w-full h-24 object-cover mb-3 rounded' />
            
            <div>
              <h1 className='text-xl font-bold mb-2'>{item.description}</h1>

              <div>
                <div className='flex flex-wrap'>
                  {item.topics.map === 1 ? (
                    <p className='mr-2 text-sm font-light'>{item.topics[0]}</p>
                  ) : (
                    <p className='mr-2 text-sm font-light'>{item.topics.join(' | ')}</p>
                  )}
                </div>
              </div>

              <div>
                <div className='flex flex-wrap'>
                  {item.levels.map === 1 ? (
                    <p className='mr-2 text-sm'>{item.levels[0]}</p>
                  ) : (
                    <p className='mr-2 text-sm'>{item.levels.join(', ')}</p>
                  )}
                </div>
              </div>

              <div>
                <div className='flex flex-wrap'>
                  {item.types.map === 1 ? (
                    <p className='mr-2 text-sm font-light'>{item.types[0]}</p>
                  ) : (
                    <p className='mr-2 text-sm font-light'>{item.types.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && !hasMore && <p>End of content</p>}
    </div>
  );
}

export default App;
