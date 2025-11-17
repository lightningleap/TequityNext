// This file contains the pagination implementation for the list view table
// Add this component right after the Table component in your list view

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
// }

// export const Pagination = ({
//   currentPage,
//   totalPages,
//   totalItems,
//   itemsPerPage,
//   onPageChange
// }: PaginationProps) => {
//   const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   if (totalItems <= itemsPerPage) return null;

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#3F3F46] bg-white dark:bg-[#09090B]">
//       <div className="text-sm text-gray-500 dark:text-gray-400">
//         Showing {startItem} to {endItem} of {totalItems} items
//       </div>
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`px-3 py-1 border rounded-md text-sm font-medium ${
//             currentPage === 1
//               ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600 dark:border-[#3F3F46]'
//               : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:border-[#3F3F46] dark:hover:bg-[#18181B]'
//           }`}
//         >
//           Previous
//         </button>
//         {/* <div className="text-sm text-gray-700 dark:text-gray-300 px-2">
//           {currentPage} of {totalPages}
//         </div> */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage >= totalPages}
//           className={`px-3 py-1 border rounded-md text-sm font-medium ${
//             currentPage >= totalPages
//               ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600 dark:border-[#3F3F46]'
//               : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:border-[#3F3F46] dark:hover:bg-[#18181B]'
//           }`}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };
