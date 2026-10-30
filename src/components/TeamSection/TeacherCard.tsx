import Image from "next/image";
import type { Teacher } from "./team.data";

type TeacherCardProps = {
  teacher: Teacher;
};

export default function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Image
      src={teacher.image}
      alt={teacher.alt}
      width={teacher.width}
      height={teacher.height}
      sizes="320px"
    />
  );
}
