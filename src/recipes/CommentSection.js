import React, { useEffect, useState } from 'react';

const CommentSection = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    useEffect(() => {
        fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${recipeId}/comments/`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(() => setError('Не удалось загрузить комментарии'));

        const token = localStorage.getItem('accessToken');
        setUserAuthenticated(!!token);
    }, [recipeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const res = await fetch(`https://erko123.pythonanywhere.com/api/v1/recipes/${recipeId}/comments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.text || 'Ошибка при добавлении');
        } else {
            const newComment = await res.json();
            setComments(prev => [newComment, ...prev]);
            setText('');
            setError('');
        }
    };

    return (
        <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">💬 Комментарии</h4>

            {userAuthenticated && (
                <form onSubmit={handleSubmit} className="mb-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Оставьте комментарий..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Добавить
                    </button>
                </form>
            )}

            {comments.length === 0 ? (
                <p className="text-sm text-gray-500">Комментариев пока нет.</p>
            ) : (
                <ul className="space-y-2">
                    {comments.map(comment => (
                        <li key={comment.id} className="bg-white p-3 border rounded shadow-sm">
                            <p className="text-sm text-gray-800">{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                От: <strong>{comment.author.username}</strong> • {new Date(comment.created_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommentSection;
