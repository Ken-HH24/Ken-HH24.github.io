import axios from 'axios';
import { useRef } from 'react';
import { parseCookies } from '../../helpers';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const getTodos = async (params) => {
    let id;
    if (typeof params == 'object' && params.queryKey) {
        id = params.queryKey[1].id;
    } else {
        id = params.id;
    }
    const res = await axios.get(`http://127.0.0.1:8080/todo/${id}`);
    const todos = JSON.parse(res.data.todos)
    return todos;
}

const createTodo = async ({ id, content }) => {
    const res = await axios.post(`http://127.0.0.1:8080/todo/${id}`, { content });
    return res;
}

const deleteTodo = async ({ id }) => {
    const res = await axios.delete(`http://127.0.0.1:8080/todo/${id}`);
    return res;
}

export const getServerSideProps = async ({ params, req }) => {
    let user;

    try {
        const { token } = parseCookies(req);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get('http://127.0.0.1:8080/user/info');
        user = res.data.user;
    } catch (err) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    const { id } = params;
    const todos = await getTodos({ id });

    return {
        props: {
            id,
            todos,
            user: JSON.parse(user)
        }
    }
}

const Todo = ({ id, todos, user }) => {
    const contentRef = useRef(null);

    const queryClient = useQueryClient();
    const todosQuery = useQuery(['todos', { id }], getTodos, { initialData: todos });

    const createTodoMutation = useMutation(createTodo, {
        onSuccess: () => {
            contentRef.current.value = '';
            queryClient.invalidateQueries('todos');
        }
    });

    const deleteTodoMutation = useMutation(deleteTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries('todos');
        }
    })

    const handleCreateTodo = () => {
        const content = contentRef.current.value;
        createTodoMutation.mutate({
            id,
            content
        })
    }

    const handleDeleteTodo = (id) => {
        deleteTodoMutation.mutate({ id });
    }

    return (
        <div>
            <h1>{`${user.username}'s Todo`}</h1>
            {
                (todosQuery.isLoading || todosQuery.isError)
                    ? <div>loading ...</div>
                    : <div>
                        {
                            todosQuery.data.map(todo => {
                                return (
                                    <div
                                        key={todo.ID}
                                        onClick={() => { handleDeleteTodo(todo.ID) }}
                                    >
                                        <h3>{todo.content}</h3>
                                    </div>
                                )
                            })
                        }
                    </div>
            }
            <input ref={contentRef} />
            <button onClick={handleCreateTodo}>create</button>
        </div>
    )
}

export default Todo;