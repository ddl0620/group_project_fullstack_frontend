'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import AuthLink from '../../components/sub_components/AuthLink.jsx';
import SubmitButton from '../../components/sub_components/SubmitButton.jsx';
import TextInputField from '../../components/sub_components/TextInputField.jsx';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils.js';
import { CalendarIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

function SignUpForm() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        dob: '',
        gender: '',
    });
    const [date, setDate] = useState();
    const [error, setError] = useState(null);
    const { handleSignUp } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form behavior
        await handleSignUp(userData, setError);
    };

    return (
        <form
            className="mx-auto flex w-full max-w-sm flex-col justify-center p-6 md:p-10"
            onSubmit={handleRegister} // Wrap in a form and use onSubmit
        >
            <div>
                <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight text-neutral-800">
                    Create an account. <br /> Join us today!
                </h2>

                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <div className="flex flex-col justify-center gap-y-2">
                    <TextInputField
                        label="Full name"
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />

                    <TextInputField
                        label="Email"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />

                    <div className="space-y-2">
                        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Date of Birth
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'text-black',
                                        'w-full pl-3 text-left font-normal',
                                        !userData.dob &&
                                            'text-muted-foreground rounded-xl border border-gray-200'
                                    )}
                                >
                                    {userData.dob ? (
                                        format(userData.dob, 'PPP')
                                    ) : (
                                        <span>Chọn ngày sinh</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto border-none p-0"
                                align="start"
                            >
                                <Calendar
                                    className="bg-white"
                                    mode="single"
                                    selected={userData.dob}
                                    onSelect={(newDate) => {
                                        setDate(newDate);
                                        setUserData((prev) => ({
                                            ...prev,
                                            dob: newDate
                                                ? format(newDate, 'yyyy-MM-dd')
                                                : '',
                                        }));
                                    }}
                                    disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date('1900-01-01')
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Gender
                        </label>
                        <Select
                            onValueChange={(value) => {
                                setUserData((prev) => ({
                                    ...prev,
                                    gender: value,
                                }));
                            }}
                            value={userData.gender}
                        >
                            <SelectTrigger className="w-full rounded-lg border-gray-200">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent
                                className={'border-gray-200 bg-white'}
                            >
                                <SelectItem
                                    className={
                                        'hover:cursor-pointer hover:bg-gray-200'
                                    }
                                    value="male"
                                >
                                    Male
                                </SelectItem>
                                <SelectItem
                                    className={
                                        'hover:cursor-pointer hover:bg-gray-200'
                                    }
                                    value="female"
                                >
                                    Female
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <TextInputField
                        label="Password"
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />

                    <TextInputField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                    />

                    <SubmitButton
                        type="submit" // Change to type="submit" instead of onClick
                        className="mt-5 bg-black p-2 text-white hover:bg-gray-800"
                    >
                        Register
                    </SubmitButton>
                </div>

                <AuthLink
                    message={'Already have an account?'}
                    linkText={'Login'}
                    linkHref={'/sign-in'}
                />
            </div>
        </form>
    );
}

export default SignUpForm;
