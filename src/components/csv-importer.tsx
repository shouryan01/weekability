import {CSVImporter} from "csv-import-react";
import { useTheme } from "@/components/theme-provider";
import React from "react";
import {CustomStyles, TransactionColumns} from "@/lib/types.ts";

export default function ImportCSV({ isOpen, setIsOpen }:{ isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const { theme } = useTheme();

    return (
        <CSVImporter
            modalIsOpen={isOpen}
            modalOnCloseTriggered={() => setIsOpen(false)}
            darkMode={theme === 'dark'}
            onComplete={(data) => console.log(data)}
            template={{
                columns: TransactionColumns
            }}
            customStyles={CustomStyles}
        />
    )
}