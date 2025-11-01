'use client';

import Background from '@/components/common/Background';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AdSpace from '@/components/goods/AdSpace';
import ItemList from '@/components/goods/ItemList';
import Pagination from '@/components/goods/Pagination';
import SearchForm from '@/components/goods/SearchForm';
import useGoodsLogic from '@/hooks/useGoodsLogic';

export default function GoodsPage() {
    const {
        items,
        recommended,
        keyword,
        setKeyword,
        category,
        setCategory,
        page,
        setPage,
        loading,
        error,
        recommendedError,
        useGenreId,
        setUseGenreId,
        useAvailability,
        setUseAvailability,
        searchHistory,
        handleSearch,
        handleItemClick,
        viewMode,
        setViewMode, // 追加: ビュー切り替え
        isLoading,
        isError,
        handleRemoveHistory,
    } = useGoodsLogic(); // useGoodsLogicにviewMode追加

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Background />
            <div className="relative z-10">
                <SearchForm
                    keyword={keyword}
                    setKeyword={setKeyword}
                    category={category}
                    setCategory={setCategory}
                    useGenreId={useGenreId}
                    setUseGenreId={setUseGenreId}
                    useAvailability={useAvailability}
                    setUseAvailability={setUseAvailability}
                    handleSearch={handleSearch}
                    searchHistory={searchHistory}
                    loading={loading}
                    setPage={setPage}
                    handleRemoveHistory={handleRemoveHistory}
                />
                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="hidden md:flex items-center justify-between mt-4 mb-4">
                        <p className="text-sm text-purple-200">{items.length}件の商品</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-10 text-purple-300'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white bg-opacity-10 text-purple-300'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                    {recommended.length > 0 && (
                        <ItemList
                            items={recommended}
                            category={category}
                            viewMode={viewMode} // 追加: viewMode渡す
                            title="おすすめガンダム商品"
                            error={recommendedError}
                            onItemClick={handleItemClick}
                        />
                    )}
                    {items.length > 0 && (
                        <ItemList
                            items={items}
                            category={category}
                            viewMode={viewMode} // 追加: viewMode渡す
                            title={`検索結果（${items.length}件）`}
                            error={error}
                            onItemClick={handleItemClick}
                        />
                    )}
                    {error && !items.length && !loading && (
                        <p className="text-purple-200 mt-8">{error}</p>
                    )}
                    {!loading && !error && items.length === 0 && recommended.length === 0 && (
                        <p className="text-purple-200 mt-8">検索ボタンを押してガンダムグッズを探してください！</p>
                    )}
                    {items.length > 0 && (
                        <Pagination
                            page={page}
                            setPage={setPage}
                            handleSearch={handleSearch}
                            loading={loading}
                            hasNextPage={items.length >= 30}
                        />
                    )}
                    {isLoading && <LoadingSpinner />}

                    {isError && !isLoading && (
                        <p className="text-purple-200 mt-8 text-center">
                            通信エラー発生。コロニーに帰還できませんでした…
                        </p>
                    )}

                    {!isLoading && !isError && items.length > 0 && (
                        <ItemList
                            items={items}
                            category={category}
                            viewMode={viewMode}
                            title={`検索結果（${items.length}件）`}
                            error={error}
                            onItemClick={handleItemClick}
                        />
                    )}
                    <AdSpace />
                </main>
            </div>
        </div>
    );
}