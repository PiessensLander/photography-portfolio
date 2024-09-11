import Icon from "./Icon";
import { IconProps } from "./Icon";

export default function ExifDataCard({ name, value }: IconProps & { value: string }) {
    return (
        <div className="flex items-center gap-2 py-2">
            <Icon name={name} size={24} />
            <p>{value}</p>
        </div>
    );

}