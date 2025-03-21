import { useState, useEffect } from 'react';
import { Repository } from '../types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface RepositoryListProps {
  repositories: Repository[];
  fetchRepositories: (posted?: boolean, page?: number, append?: boolean, fetchAll?: boolean, itemsPerPage?: number) => Promise<void>;
  stats: { all: number; posted: number; unposted: number };
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  const [allRepositories, setAllRepositories] = useState<Repository[]>([]);
  
  useEffect(() => {
    setAllRepositories(repositories);
  }, [repositories]);
  const [searchTerm, setSearchTerm] = useState(() => {
    const saved = localStorage.getItem('dashboardSearchTerm');
    return saved || '';
  });
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'unposted'>(() => {
    const saved = localStorage.getItem('dashboardStatusFilter');
    return (saved as 'all' | 'posted' | 'unposted') || 'all';
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const saved = localStorage.getItem('dashboardItemsPerPage');
    return saved ? parseInt(saved, 10) : 5;
  });
  
  const [loading] = useState(false);



  const handleStatusFilterChange = (value: 'all' | 'posted' | 'unposted') => {
    if (loading) return;
    
    setStatusFilter(value);
    localStorage.setItem('dashboardStatusFilter', value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    if (loading) return;
    
    setItemsPerPage(value);
    localStorage.setItem('dashboardItemsPerPage', value.toString());
    setCurrentPage(1);
  };

  const filteredItems = allRepositories.filter(repo => {
    const matchesSearch = searchTerm === '' || 
      repo.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (repo.text && repo.text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'posted' && repo.posted) || 
      (statusFilter === 'unposted' && !repo.posted);
    
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredItems.length;
  const totalRepositories = totalItems;
  const totalPages = itemsPerPage === 0 ? 1 : Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedItems = itemsPerPage === 0 
    ? filteredItems 
    : filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Repositories</h2>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              localStorage.setItem('dashboardSearchTerm', value);
            }}
            className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 py-2 px-3 text-sm md:text-base"
          />
        </div>
        
        <div className="flex items-center space-x-4 relative">
          <div className="flex items-center space-x-4 relative">

            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value as 'all' | 'posted' | 'unposted')}
              className="rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm md:text-base py-2 pl-3 pr-8 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-36 text-center appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
              style={{ backgroundPosition: 'right 0.5rem center', backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="all">All</option>
              <option value="posted">Posted</option>
              <option value="unposted">Unposted</option>
            </select>
            

            <select 
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm md:text-base py-2 pl-3 pr-8 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 w-20 text-center appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
              style={{ backgroundPosition: 'right 0.5rem center', backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value={0}>All</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="md:block hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">Repository</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/4">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {totalItems === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No repositories found
                  </td>
                </tr>
              ) : (
                paginatedItems.map((repo) => (
                  <tr key={repo.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <a 
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        {repo.url.replace('https://github.com/', '')}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="overflow-hidden">
                        <p className="whitespace-normal break-words">{repo.text}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        repo.posted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {repo.posted ? 'Posted' : 'Unposted'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden block">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Repositories</span>
          </div>
          {totalItems === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No repositories found
            </div>
          ) : (
            paginatedItems.map((repo) => (
              <div key={repo.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Repository</span>
                  <div className="mt-1">
                    <a 
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      {repo.url.replace('https://github.com/', '')}
                    </a>
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</span>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">
                    <p className="whitespace-normal break-words">{repo.text}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      repo.posted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}>
                      {repo.posted ? 'Posted' : 'Unposted'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      

      {totalItems > 0 && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 w-full">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {itemsPerPage === 0 ? (
                <p>Showing all <span className="font-medium">{totalItems}</span> results</p>
              ) : (
                <p>
                  Showing <span className="font-medium">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                  </span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{totalRepositories}</span> results

                </p>
              )}
            </div>


            {itemsPerPage > 0 && totalItems > itemsPerPage && (
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                  }}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                      }}
                      className={`relative inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border ${currentPage === pageNum ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'} text-xs sm:text-sm font-medium rounded-md min-w-[30px] sm:min-w-[40px] text-center justify-center`}
                      title={`Go to page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  }}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
