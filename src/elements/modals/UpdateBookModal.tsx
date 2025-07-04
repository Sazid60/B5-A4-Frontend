import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { BookFormValues, IApiError, IBookCardProps } from "@/types/types";
import { useUpdateBookMutation } from "@/redux/api/baseApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useEffect } from "react";

export default function UpdateBookModal({ book }: IBookCardProps) {
    const navigate = useNavigate();

    const form = useForm<BookFormValues>({
        mode: "onChange",
        defaultValues: {
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            genre: book.genre,
            description: book.description,
            copies: book.copies,
            available: book.available ?? true,
        },
    });

    const { control, handleSubmit, watch, formState } = form;
    const { isValid } = formState;

    const watchedValues = watch();

    const hasChanged = Object.keys(watchedValues).some((key) => {
        const typedKey = key as keyof BookFormValues;
        return watchedValues[typedKey] !== book[typedKey];
    });

    const [updateBook, { isLoading, isError, error }] = useUpdateBookMutation();

    useEffect(() => {
        if (isError && error) {
            const errMsg =
                (error as IApiError)?.data?.message || "Failed to update book";
            toast.error(errMsg);
        }
    }, [isError, error]);

    const onSubmit: SubmitHandler<BookFormValues> = async (formData) => {
        formData.available = formData.copies > 0;
        const res = await updateBook({ id: book._id, ...formData }).unwrap();
        toast.success(res.message || "Book updated successfully");
        navigate("/books");
    };

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle className="text-center">Update Book</DialogTitle>
                <DialogDescription className="text-center">
                    Edit the fields below to update this book's details.
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    {/* Title */}
                    <FormField
                        control={control}
                        name="title"
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Author */}
                    <FormField
                        control={control}
                        name="author"
                        rules={{ required: "Author is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Author Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ISBN */}
                    <FormField
                        control={control}
                        name="isbn"
                        rules={{ required: "ISBN is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ISBN</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter ISBN Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Genre */}
                    <FormField
                        control={control}
                        name="genre"
                        rules={{ required: "Genre is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Genre</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Genre" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="FICTION">Fiction</SelectItem>
                                        <SelectItem value="NON_FICTION">Non-Fiction</SelectItem>
                                        <SelectItem value="SCIENCE">Science</SelectItem>
                                        <SelectItem value="HISTORY">History</SelectItem>
                                        <SelectItem value="BIOGRAPHY">Biography</SelectItem>
                                        <SelectItem value="FANTASY">Fantasy</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Book description..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Copies */}
                    <FormField
                        control={control}
                        name="copies"
                        rules={{
                            required: "Copies is required",
                            min: { value: 0, message: "Copies cannot be negative" },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Copies</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Buttons */}
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <DialogClose disabled={isLoading || !hasChanged || !isValid}>
                            <Button
                                type="submit"
                                disabled={isLoading || !hasChanged || !isValid}
                                className="flex items-center gap-2 bg-main hover:bg-purple-800 transition rounded-lg text-white font-semibold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    "Update"
                                )}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
