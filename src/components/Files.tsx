import type { File } from '@prisma/client'
import FileCard from '@/components/FileCard'

export default function Files({ files }: { files: File[] }) {
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 ">
        {files.map((file: File, i: number) => (
          <FileCard key={i} file={file} />
        ))}
      </div>
    </div>
  )
}
