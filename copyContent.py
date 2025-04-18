import os

def combine_files_in_directory(start_dir, output_file):
    with open(output_file, 'w', encoding='utf-8') as output:
        for root, dirs, files in os.walk(start_dir):
            for filename in files:
                # Get the full file path
                file_path = os.path.join(root, filename)
                
                # Open each file and write its content to the output file
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        # Write the filename as the first line
                        output.write(f"--- Start of {file_path} ---\n")
                        # Write the content of the file
                        output.write(file.read())
                        output.write("\n\n")  # Add a newline between files
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")

if __name__ == "__main__":
    # Set the directory to start from and the output file name
    start_directory = "./src"  # Replace with your directory path
    output_filename = "combined_output.txt"    # Output file name
    
    combine_files_in_directory(start_directory, output_filename)
    print(f"Contents from all files have been combined into '{output_filename}'.")
