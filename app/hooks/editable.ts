import { useFetcher } from "@remix-run/react";
import { Post } from "db/schema";
import { useEffect, useRef, useState } from "react";

export const useEditable = (post: Post) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [content, setContent] = useState<string>(post.body || "");

	const formRef = useRef<HTMLFormElement | null>(null);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const fetcher = useFetcher();

	useEffect(() => {
		if (isEditing && textAreaRef.current) {
			textAreaRef.current.focus();
			textAreaRef.current.select();
		}
	}, [isEditing]);

	const handleBlur = () => {
		fetcher.submit(formRef.current, {
			method: "PATCH",
		});
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (textAreaRef.current) {
				textAreaRef.current.blur();
			}
		}
	};

	return {
		isEditing,
		setIsEditing,
		content,
		formRef,
		textAreaRef,
		handleBlur,
		handleKeyDown,
		setContent
	}
};
