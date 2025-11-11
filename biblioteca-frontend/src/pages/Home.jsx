export default function Home() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo à Biblioteca</h1>
                <p className="text-lg text-gray-600 mb-8">Gerencie seus livros e autores de forma fácil e eficiente.</p>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-800 mb-2">Livros</h2>
                        <p className="text-blue-600">Explore nossa coleção de livros.</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-green-800 mb-2">Autores</h2>
                        <p className="text-green-600">Conheça os autores disponíveis.</p>
                    </div>
                </div>  
            </div>
        </main>
    )
}
